from rest_framework import serializers
from .models import Product,Category,ProductImage,Review
from accounts.serializers.serializers import UserFullNameSerializer
class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model=Category
        fields=("id","name","slug")

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductImage
        fields=("id","image")
    pass


class ReviewSerializer(serializers.ModelSerializer):
    user=UserFullNameSerializer(read_only=True)
    class Meta:
        model=Review
        fields=("id","user","comment","rating","created_at")

class ProductSerializer(serializers.ModelSerializer):
    category=CategorySerializer(read_only=True)
    images=ProductImageSerializer(many=True,read_only=True)
    reviews=ReviewSerializer(read_only=True,many=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        write_only=True,
        source="category"
    )
    class Meta:
        model =Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "stock",
            "is_active",
            "category",
            "category_id",
            "images",
            "reviews"
        ]