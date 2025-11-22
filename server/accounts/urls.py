from django.urls import path
from .Views.password_rest import PasswordResetRequestView,PasswordResetConfirmView
urlpatterns = [
    path("", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("<uid>/<token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]
