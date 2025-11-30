from django.urls import path
from .views import ListOrderView
urlpatterns = [
    path("orderList/",ListOrderView.as_view(),name="order-list"),
    
]
