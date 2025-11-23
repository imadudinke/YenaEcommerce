from django.shortcuts import render
from rest_framework import generics,filters
from django_filters.rest_framework import DjangoFilterBackend
from .filter import ProductFilter
from .models import Product
from .serializers import ProductSerializer
class ProductListView(generics.ListAPIView):
    queryset=Product.objects.filter(is_active=True).order_by("-id")
    serializer_class=ProductSerializer
    filter_backends=[DjangoFilterBackend,filters.SearchFilter]
    filterset_class=ProductFilter
    search_fields=["name","description"]

class ProductDetailView(generics.RetrieveAPIView):
    queryset=Product.objects.filter(is_active=True)
    serializer_class=ProductSerializer
    lookup_field="slug"

class ProductByCategoryView(generics.ListAPIView):
     serializer_class=ProductSerializer
     def get_queryset(self,*arg,**kwarg):
         category_slug=self.kwargs["slug"]
         return Product.objects.filter(category__slug=category_slug,is_active=True)