from rest_framework import serializers
from .models import CartItem,Cart
from products.models import Product,ProductImage
from .models import CartItem, Cart

class ProductMiniSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ("id", "name", "price", "image")

    def get_image(self, obj):
        first_image = obj.images.first()
        if first_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None


class CartItemSerializer(serializers.ModelSerializer):
    product=ProductMiniSerializer(read_only=True)

    class Meta:
        model=CartItem
        fields=("id","product","quantity")


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        
        fields = ["items", "total_items", "total_price"]

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_price(self, obj):
        return sum((item.product.price * item.quantity) for item in obj.items.all())

