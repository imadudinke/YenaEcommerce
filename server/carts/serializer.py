from rest_framework import serializers
from .models import CartItem,Cart
from products.models import Product
from .models import CartItem, Cart

class ProductMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "name", "price")


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

