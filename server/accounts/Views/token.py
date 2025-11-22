from rest_framework_simplejwt.views import TokenObtainPairView
from accounts.serializers.token import CustomTokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class=CustomTokenObtainPairSerializer

    def post(self,request,*args,**kwargs):

        serializer=self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        
        tokens = serializer.validated_data
        access=tokens["access"]
        refresh=tokens["refresh"]
        response = Response(
            {"message": "Login successful"},
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
