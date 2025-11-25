from rest_framework import serializers
from .models import Product,Category,ProductImage,Review
from home.models import Banner
from accounts.serializers.serializers import UserFullNameSerializer
class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model=Category
        fields=("id","name","slug","image")

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
class SimpleProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
       
        first = obj.images.first()
        if not first:
            return None
        request = self.context.get("request") if hasattr(self, 'context') else None
        try:
            url = first.image.url
        except Exception:
            return None
        if request is not None:
            return request.build_absolute_uri(url)
        return url
    class Meta:
        model = Product
        fields = ["id", "name", "price", "image"]

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "image", "url", "order"]
