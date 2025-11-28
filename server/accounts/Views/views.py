# views.py (Django DRF)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.serializers.serializers import UserSerializer,RegisterSerializer
from accounts.authentication import JWTAuthenticationFromCookie
class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterNewUserView(APIView):
    permission_classes = [] 
    authentication_classes = []

    def get(self, request):
        serializer = RegisterSerializer()
        return Response(serializer.data)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated] 
    authentication_classes = [JWTAuthenticationFromCookie]

    def post(self, request, *args, **kwargs):
       try:   
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                 refresh_token = request.COOKIES.get('refresh') 

            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response(
                {"detail": "Successfully logged out and tokens blacklisted."}, 
                status=status.HTTP_200_OK
            )
            
            response.delete_cookie('access')
            response.delete_cookie('refresh')
            
            return response

       except Exception as e:
            return Response(
                {"detail": "Invalid token or token not provided."}, 
                status=status.HTTP_400_BAD_REQUEST
            )