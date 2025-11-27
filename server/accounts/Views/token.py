from rest_framework_simplejwt.views import TokenObtainPairView
from accounts.serializers.token import CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status
from carts.helper import merge_carts
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = serializer.user 
        
        if user is not None and user.is_authenticated:
            merge_carts(request, user)
            
        tokens = serializer.validated_data
        access = tokens["access"]
        refresh = tokens["refresh"]

        user_data = serializer.validated_data.get("user", {})
        response = Response(
            {"message": "Login successful", "user": user_data},
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access",
            value=access,
            httponly=True,
            secure=False,
            samesite="Lax"
        )
        response.set_cookie(
            key="refresh",
            value=refresh,
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        return response


class CustomTokenRefreshCookieView(APIView):
    """
    Issue a new access token from the HttpOnly 'refresh' cookie and set it as an HttpOnly 'access' cookie.
    """

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({"message": "Token refreshed"}, status=status.HTTP_200_OK)
        response.set_cookie(
            key="access",
            value=access,
            httponly=True,
            secure=False,
            samesite="Lax",
        )
        return response