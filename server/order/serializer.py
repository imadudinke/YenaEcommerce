from rest_framework import serializers
from .models import OrderAddress,OrderItem,Order
from products.models import Product

class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderAddress
        fields=("full_name","phone","city","sub_city","street","house_no")
    
# class OrderItemSerializer(serializers.ModelSerializer):
#     product = serializers.PrimaryKeyRelatedField(
#         queryset=Product.objects.all()
#     )

#     class Meta:
#         model = OrderItem
#         fields = ["id", "product", "quantity"]


# class OrderSerializer(serializers.ModelSerializer):
#     address = OrderAddressSerializer(read_only=True)
#     items = OrderItemSerializer(many=True, read_only=True)

#     address_data = OrderAddressSerializer(write_only=True)
#     items_data = OrderItemSerializer(write_only=True, many=True)

#     class Meta:
#         model = Order
#         fields = [
#             "id",
#             "user",
#             "address",
#             "items",
#             "address_data",
#             "items_data",
#             "total_price",
#             "is_paid",
#             "status",
#             "created_at",
#         ]
#         read_only_fields = ["id", "is_paid", "status", "created_at", "total_price"]

#     def create(self, validated_data):
      
#         address_data = validated_data.pop("address_data")
        
#         items_data = validated_data.pop("items_data")

        
#         address = OrderAddress.objects.create(**address_data)

