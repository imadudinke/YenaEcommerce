from django.urls import path
from accounts.Views.views import CurrentUserView,RegisterNewUserView,LogoutView
urlpatterns = [
    path("user/", CurrentUserView.as_view(), name="get-active-user"),
    path("user/create/", RegisterNewUserView.as_view(), name="create-user"),
    path("logout/", LogoutView.as_view(), name="logout-user"),
]
