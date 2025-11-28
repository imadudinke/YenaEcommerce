from django.urls import path
from .Views.password_rest import PasswordResetRequestView, PasswordResetConfirmView
from .Views.views import CurrentUserView
urlpatterns = [
   
    path("password_rest/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("password_rest/<uid>/<token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("aut/user/",CurrentUserView.as_view(),name="get-active-user")
]
