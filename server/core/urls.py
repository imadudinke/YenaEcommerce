"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (

    TokenRefreshView,
    TokenVerifyView
)
from accounts.Views.token import CustomTokenObtainPairView, CustomTokenRefreshCookieView
import importlib

AUTH_URLS_MODULE = None
ORDER_URLS_MODULE=None
try:
    importlib.import_module("accounts.urls_auth")
    importlib.import_module("order.url_order")
    AUTH_URLS_MODULE = "accounts.urls_auth"
    ORDER_URLS_MODULE = "order.url_order"
   
except ModuleNotFoundError:
    try:
        importlib.import_module("server.accounts.urls_auth")
        importlib.import_module("order.url_order")
        AUTH_URLS_MODULE = "server.accounts.urls_auth"
        ORDER_URLS_MODULE = "order.url_order"
    except ModuleNotFoundError:
        AUTH_URLS_MODULE = None
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/refresh-cookie/', CustomTokenRefreshCookieView.as_view(), name='token_refresh_cookie'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
 
    *(
        [path("api/auth/", include(AUTH_URLS_MODULE))]
        if AUTH_URLS_MODULE
        else []
    ),
     *(
        [path("api/", include(ORDER_URLS_MODULE))]
        if ORDER_URLS_MODULE
        else []
    ),
    path("api/password_rest/", include("accounts.urls")),
    # 
    path("api/products/",include("products.urls")),
    # 
    path("api/cart/",include("carts.urls")),
    path("api/payment/",include("order.urls")),
    path("api/home/",include("home.urls"))

]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
