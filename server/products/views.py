from django.shortcuts import render
from rest_framework import generics
# Create your views here.
from .models import Product
from .serializers import ProductSerializer
class ProductListView(generics.ListAPIView):
    queryset=Product.objects.filter(is_active=True)
    serializer_class=ProductSerializer
   

class ProductDetailView(generics.RetrieveAPIView):
    queryset=Product.objects.filter(is_active=True)
    serializer_class=ProductSerializer
    lookup_field="slug"

class ProductByCategoryView(generics.ListAPIView):
     serializer_class=ProductSerializer
     def get_queryset(self,*arg,**kwarg):
         category_slug=self.kwargs["slug"]
         return Product.objects.filter(category__slug=category_slug,is_active=True)