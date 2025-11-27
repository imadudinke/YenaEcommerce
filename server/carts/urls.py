from django.urls import path
from .views import AddToCartView,CartProductList,RemoveCart,IncreaseOrDecreaseNumber
urlpatterns = [
    path("", CartProductList.as_view(), name="Cart-list"),
    path("add/", AddToCartView.as_view(), name="Add-to-cart"),
    path("remove/", RemoveCart.as_view(), name="remove-from-cart"),
    path("quantity/",IncreaseOrDecreaseNumber.as_view(),name="Increase-Decrease-Quantity")
]