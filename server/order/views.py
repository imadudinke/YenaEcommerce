from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from carts.models import Cart,CartItem
from .serializer import OrderAddressSerializer
from carts.serializer import CartSerializer 
from .models import OrderAddress,Order, OrderItem,PendingPayment
import uuid
import os
import requests
from django.conf import settings
CHAPA_SECRET_KEY = os.getenv("CHAPA_SECRET_KEY")
CHAPA_CALLBACK_URL = os.getenv("CHAPA_CALLBACK_URL")

class InitiatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user

        user_cart = get_object_or_404(Cart, user=user)
        if not user_cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        address_serializer = OrderAddressSerializer(data=request.data)
        address_serializer.is_valid(raise_exception=True)

        cart_serializer = CartSerializer(user_cart)
        total_price = cart_serializer.get_total_price(user_cart)

        tx_ref = f"tx-{uuid.uuid4().hex}"

        order_details_json = {
            "address": address_serializer.validated_data,
            "items": [
                {
                    "product_id": item.product.id,
                    "quantity": item.quantity,
                    "price": str(item.product.price)
                }
                for item in user_cart.items.all()
            ]
        }
        
        PendingPayment.objects.create(
            transaction_reference=tx_ref,
            user=user,
            total_price=total_price,
            order_details=order_details_json 
        )

        payload = {
            "amount": str(total_price),
            "currency": "ETB",
            "availablePaymentMethods": ['telebirr', 'cbebirr', 'ebirr', 'mpesa', 'chapa'],
   
            "email": user.email,
            "first_name": getattr(user, "full_name", user.full_name or ""),
            "last_name": getattr(user, "last_name", ""),
            "phone_number": getattr(user, "phone", ""),
            "tx_ref": tx_ref,
            "callback_url": getattr(settings, "CHAPA_CALLBACK_URL", CHAPA_CALLBACK_URL),
            "return_url": getattr(settings, "CHAPA_RETURN_URL", None),
            "customization": {
                "title": "Order Payment",
                "hide_receipt": True,
                "description": "Payment for cart items"
            },
            "metadata": {
                "user_id": user.id,
                "cart_id": user_cart.id
            }
        }

        headers = {
            "Authorization": f"Bearer {getattr(settings, 'CHAPA_SECRET_KEY', CHAPA_SECRET_KEY)}",
            "Content-Type": "application/json",
        }

        url = "https://api.chapa.co/v1/transaction/initialize"
        response = requests.post(url, json=payload, headers=headers, timeout=20)

        try:
            chapa_data = response.json()
        except ValueError:
            chapa_data = {"status_code": response.status_code, "text": response.text}

        if response.status_code != 200:
            return Response({
                "error": "Chapa initialize returned non-200",
                "details": chapa_data
            }, status=status.HTTP_502_BAD_GATEWAY)

        if chapa_data.get("status") != "success":
            return Response({
                "error": "Failed to initialize payment with Chapa",
                "details": chapa_data
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = chapa_data.get("data") or {}
        payment_url = data.get("checkout_url")
        if not payment_url:
            return Response({
                "error": "Chapa initialize did not include checkout_url",
                "details": chapa_data
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"payment_url": payment_url, "tx_ref": tx_ref}, status=status.HTTP_200_OK)



@method_decorator(csrf_exempt, name='dispatch')
class PaymentCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        trx_ref = request.GET.get("trx_ref")
        if not trx_ref:
            return Response(
                {"error": "Missing trx_ref in callback"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            staging_payment = PendingPayment.objects.get(transaction_reference=trx_ref)
            user = staging_payment.user
            pending_data = staging_payment.order_details 
        except PendingPayment.DoesNotExist:
            return Response(
                {"error": f"No pending order found for ref: {trx_ref}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        verify_url = f"https://api.chapa.co/v1/transaction/verify/{trx_ref}"
        headers = {
            "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}"
        }

        chapa_res = requests.get(verify_url, headers=headers, timeout=15)

        try:
            chapa_data = chapa_res.json()
        except ValueError:
            return Response(
                {"error": "Chapa returned invalid JSON", "raw": chapa_res.text},
                status=status.HTTP_502_BAD_GATEWAY
            )

        if chapa_data.get("status") != "success":
            return Response(
                {"error": "Payment verification failed", "details": chapa_data},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_status = chapa_data.get("data", {}).get("status")
        if payment_status != "success":
            return Response(
                {"error": "Payment not successful", "details": chapa_data},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            with transaction.atomic():
                address = OrderAddress.objects.create(
                    user=user,
                    **pending_data["address"]
                )

                order = Order.objects.create(
                    user=user,
                    address=address,
                    total_price=staging_payment.total_price,
                    is_paid=True,
                    status="completed",
                    transaction_reference=trx_ref
                )

                OrderItem.objects.bulk_create([
                    OrderItem(
                        order=order,
                        product_id=i["product_id"],
                        quantity=i["quantity"],
                        price=i["price"]
                    )
                    for i in pending_data["items"]
                ])

                CartItem.objects.filter(cart__user=user).delete()
                staging_payment.delete()

            return Response(
                {
                    "message": "Payment verified successfully",
                    "order_id": order.id,
                    "tx_ref": trx_ref
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Order save failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )