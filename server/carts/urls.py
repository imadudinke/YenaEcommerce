from django.urls import path
from .views import AddToCartView,CartProductList
urlpatterns = [
    path("", CartProductList.as_view(), name="Cart-list"),
    path("add/", AddToCartView.as_view(), name="Add-to-cart"),
]