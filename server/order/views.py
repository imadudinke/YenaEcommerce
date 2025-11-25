from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.db import transaction
from carts.models import Cart,CartItem
from .serializer import OrderAddressSerializer
from carts.serializer import CartSerializer 
from .models import OrderAddress,Order, OrderItem
class InitiatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        
        user_cart = get_object_or_404(Cart, user=user)
        if not user_cart.items.exists():
            return Response({"error": "Cannot initiate payment for an empty cart."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        address_serializer = OrderAddressSerializer(data=request.data)
        address_serializer.is_valid(raise_exception=True)

        cart_serializer = CartSerializer(user_cart)
        total_price = cart_serializer.get_total_price(user_cart)

        order_data_to_store = {
            'user_id': user.id,
            'total_price': str(total_price), 
            'address_data': address_serializer.validated_data, 
            'cart_items': [
                {
                    'product_id': item.product.id,
                    'quantity': item.quantity,
                    'price': str(item.product.price) 
                } for item in user_cart.items.all()
            ]
        }

        
        request.session['pending_order_data'] = order_data_to_store
        request.session.modified = True 

        return Response(
            {"message": "Payment initiated. Data stored in session."}, 
            status=status.HTTP_202_ACCEPTED
        )
""" {
    "full_name": "John Doe",
    "phone": "+1234567890",
    "city": "Addis Ababa",
    "sub_city": "Bole",
    "street": "Africa Avenue",
    "house_no": "Apt 101"
}
 """




class PaymentCallbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        payment_was_successful = True # Simulate success for this example

        order_data = request.session.get('pending_order_data')
        print(order_data,"order_data....")

        if not order_data:
            return Response({"error": "No pending order found in session."}, status=status.HTTP_400_BAD_REQUEST)

        if payment_was_successful:
            try:
                # Use a transaction to ensure all data is saved correctly
                with transaction.atomic():
                    address = OrderAddress.objects.create(
                        user_id=order_data['user_id'],
                        **order_data['address_data']
                    )

                    # B. Create the main Order object
                    order = Order.objects.create(
                        user_id=order_data['user_id'],
                        address=address,
                        total_price=order_data['total_price'],
                        is_paid=True, # Mark as paid upon success
                        status="completed"
                    )

                    # C. Create OrderItems from the session data
                    order_items_to_create = []
                    for item_data in order_data['cart_items']:
                        order_items_to_create.append(
                            OrderItem(
                                order=order,
                                product_id=item_data['product_id'],
                                quantity=item_data['quantity'],
                                price=item_data['price']
                            )
                        )
                    OrderItem.objects.bulk_create(order_items_to_create)

                    # D. Clear the user's *actual* database cart
                    CartItem.objects.filter(cart__user=request.user).delete()

                del request.session['pending_order_data']

                return Response({"message": "Order successfully placed and paid!"}, status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response({"error": f"Failed to save order to database: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
       
            del request.session['pending_order_data']
            return Response({"message": "Payment failed, session data cleared."}, status=status.HTTP_400_BAD_REQUEST)
