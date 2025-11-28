from django.urls import path
from accounts.Views.views import CurrentUserView

urlpatterns = [
    path("user/", CurrentUserView.as_view(), name="get-active-user"),
]
