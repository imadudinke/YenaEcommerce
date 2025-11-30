from rest_framework import serializers
from .models import OrderAddress,OrderItem,Order
from products.models import Product

class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderAddress
        fields=("full_name","phone","city","sub_city","street","house_no")
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "user",
            "address",
            "total_price",
            "is_paid",
            "status",
            "transaction_reference",
            "created_at",
              )