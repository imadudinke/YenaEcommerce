from django.urls import path
from .views import InitiatePaymentView,PaymentCallbackView
urlpatterns = [
    path("order/",InitiatePaymentView.as_view(),name="order-init"),
    path("order/checkout/",PaymentCallbackView.as_view(),name="order-init")
]
