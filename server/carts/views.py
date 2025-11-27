from rest_framework.response import Response
from rest_framework import generics,permissions,status
from rest_framework.views import APIView
from accounts.authentication import JWTAuthenticationFromCookie
from .helper import get_session_cart,save_session_cart
from .serializer import CartSerializer,ProductMiniSerializer
from .models import Cart,CartItem
from products.models import Product
from django.shortcuts import get_object_or_404

class CartProductList(generics.GenericAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = [JWTAuthenticationFromCookie]

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(cart)
            session_cart = get_session_cart(request=request)
            print(session_cart)
            return Response(serializer.data)
        session_cart = get_session_cart(request)
        items = []

       
        for product_id, data in session_cart.items():
            product = Product.objects.get(id=product_id)
            items.append({
                "product": ProductMiniSerializer(product).data,
                "quantity": data["quantity"]
            })

        return Response({
            "items": items,
            "total_items": sum(item["quantity"] for item in items),
            "total_price": sum(item["quantity"] * float(item["product"]["price"]) for item in items)
        })

class AddToCartView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [JWTAuthenticationFromCookie]

    def post(self, request):
       
       
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))
        
        if request.user.is_authenticated:
            print("Im Authenticated")
            cart, _ = Cart.objects.get_or_create(user=request.user)
            item, created = CartItem.objects.get_or_create(
                cart=cart,
                product_id=product_id,
            )
            print("Creating...")

            if not created:
                item.quantity += quantity

            item.save()

            return Response({"message": "Item added to cart"}, status=200)
        
        session_cart = get_session_cart(request=request)
        print("Guest")

        if str(product_id) in session_cart:
            session_cart[str(product_id)]["quantity"] += quantity
        else:
            session_cart[str(product_id)] = {"quantity": quantity}

        save_session_cart(request=request,cart=session_cart)
        session_cart = get_session_cart(request)
        print(f"DEBUG GET VIEW: Contents of retrieved session cart: {session_cart}")

        return Response({f"message": f"Item added to cart (guest) {request.session["cart"] }"}, status=200)

class RemoveCart(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [JWTAuthenticationFromCookie]
    def post(self,request):
     product_id=request.data.get("product_id")
     quantity_to_remove = int(request.data.get("quantity", 1))

     if request.user.is_authenticated:
         try:
            cart= get_object_or_404(Cart,user=request.user)

            item=get_object_or_404(CartItem,cart=cart,product_id=product_id)

            if item.quantity >quantity_to_remove:
                item.quantity -=quantity_to_remove
                item.save()
                message = f"Item {quantity_to_remove} removed from cart."
            else:
                item.delete()
                message = "Item fully removed from cart."

            return Response({"message": message}, status=status.HTTP_200_OK)
         except Cart.DoesNotExist:
                return Response({"message": "Cart not found for user."}, status=status.HTTP_404_NOT_FOUND)
         except CartItem.DoesNotExist:
                return Response({"message": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)
     else:
         session_cart = get_session_cart(request)
         str_product_id = str(product_id)

         if str_product_id in session_cart:
                current_quantity = session_cart[str_product_id]["quantity"]

                if current_quantity > quantity_to_remove:
                    
                    session_cart[str_product_id]["quantity"] -= quantity_to_remove
                    message = "Item quantity reduced in session cart."
                else:
                    
                    del session_cart[str_product_id]
                    message = "Item fully removed from session cart."

                save_session_cart(request, session_cart)
                return Response({"message": message}, status=status.HTTP_200_OK)
            
         else:
                return Response({"message": "Item not found in session cart."}, status=status.HTTP_404_NOT_FOUND) 




class IncreaseOrDecreaseNumber(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [JWTAuthenticationFromCookie]

    def post(self, request):
        product_id = request.data.get("product_id")
        desired_quantity = int(request.data.get("quantity", 0))
        print(desired_quantity,product_id)

        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if desired_quantity < 0:
             return Response({"error": "Quantity cannot be negative"}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.user.is_authenticated:
            try:
                cart = get_object_or_404(Cart, user=request.user)
              
                item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
              

                if desired_quantity > 0:
                    item.quantity = desired_quantity
                    item.save()
                    message = f"Cart item quantity updated to {desired_quantity}."
                else:
                    item.delete()
                    message = "Item removed from cart."
                
                return Response({"message": message}, status=status.HTTP_200_OK)

            except Cart.DoesNotExist:
                return Response({"message": "Cart not found for user."}, status=status.HTTP_404_NOT_FOUND)
            except CartItem.DoesNotExist:
                return Response({"message": "Item not found in cart to update."}, status=status.HTTP_404_NOT_FOUND)

        else:
            session_cart = get_session_cart(request)
            str_product_id = str(product_id)

            if str_product_id in session_cart:
                if desired_quantity > 0:
                    session_cart[str_product_id]["quantity"] = desired_quantity
                    message = f"Session cart item quantity updated to {desired_quantity}."
                else:
                    del session_cart[str_product_id]
                    message = "Item removed from session cart."
                
                save_session_cart(request, session_cart)
                return Response({"message": message}, status=status.HTTP_200_OK)
                
            else:
                return Response({"message": "Item not found in session cart."}, status=status.HTTP_404_NOT_FOUND)


    