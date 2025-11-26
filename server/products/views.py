from django.shortcuts import render
from rest_framework import generics,filters,permissions
from django_filters.rest_framework import DjangoFilterBackend
from accounts.authentication import JWTAuthenticationFromCookie
from .filter import ProductFilter
from .models import Product,Category
from .serializers import ProductSerializer
from products.serializers import ReviewSerializer,CategorySerializer
class ProductListView(generics.ListAPIView):
    queryset=Product.objects.filter(is_active=True).order_by("-id")
    serializer_class=ProductSerializer
    filter_backends=[DjangoFilterBackend,filters.SearchFilter]
    filterset_class=ProductFilter
    search_fields=["name","description"]

class ProductDetailView(generics.RetrieveAPIView):
    queryset=Product.objects.filter(is_active=True)
    serializer_class=ProductSerializer
    lookup_field="id"

class ProductByCategoryView(generics.ListAPIView):
     serializer_class=ProductSerializer
     def get_queryset(self,*arg,**kwarg):
         category_slug=self.kwargs["slug"]
         return Product.objects.filter(category__slug=category_slug,is_active=True)

class CreateProductReview(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes=[JWTAuthenticationFromCookie]

    def perform_create(self, serializer):
        product_pk = self.kwargs["id"]
        serializer.save(
            user=self.request.user,
            product_id=product_pk
        )

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset=Category.objects.all().order_by("-id")
    pass