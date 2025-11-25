from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Count
from products.models import Product, Category
from .models import Banner  
from products.serializers import CategorySerializer,BannerSerializer,SimpleProductSerializer


class HomeAPIView(APIView):
    permission_classes = []  # public, no auth required

    def get(self, request, *args, **kwargs):

        featured_products = Product.objects.filter(is_featured=True)[:10]
        new_arrivals = Product.objects.order_by('-created_at')[:10]
        categories = Category.objects.all()[:10]
        banners = Banner.objects.filter(is_active=True).order_by('order')
        
        best_sellers = (
            Product.objects
            .annotate(order_count=Count('orderitem'))
            .order_by('-order_count')[:10]
        )

        return Response({
            "banners": BannerSerializer(banners, many=True).data,
            "featured": SimpleProductSerializer(featured_products, many=True, context={"request": request}).data,
            "new_arrivals": SimpleProductSerializer(new_arrivals, many=True, context={"request": request}).data,
            "categories": CategorySerializer(categories, many=True).data,
            "best_sellers": SimpleProductSerializer(best_sellers, many=True, context={"request": request}).data,
        }, status=status.HTTP_200_OK)
