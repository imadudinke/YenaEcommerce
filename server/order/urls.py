from django.urls import path
from .views import InitiatePaymentView,PaymentCallbackView
urlpatterns = [
    path("initiate/",InitiatePaymentView.as_view(),name="order-init"),
    path("callback/",PaymentCallbackView.as_view(),name="order-init")
]
