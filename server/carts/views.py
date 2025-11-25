from rest_framework.response import Response
from rest_framework import generics,permissions
from rest_framework.views import APIView
from accounts.authentication import JWTAuthenticationFromCookie
from .helper import get_session_cart,save_session_cart
from .serializer import CartSerializer,ProductMiniSerializer
from .models import Cart,CartItem
from products.models import Product

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
        print(f"DEBUG GET VIEW: Cookies received: {request.COOKIES}")
        print(f"DEBUG GET VIEW: Session ID received: {request.session.session_key}")
        
        

       
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
