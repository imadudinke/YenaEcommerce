from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.serializers.password_reset import RestPasswordSerializer
from accounts.serializers.password_reset import PasswordRestConfirmSerializer
class PasswordResetConfirmView(APIView):
    def post(self,request,uid,token):
        data={
            "uid":uid,
            "token":token,
            "password": request.data.get("password"),
            "password2": request.data.get("password2")
        }
        serializer=PasswordRestConfirmSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password reset successful!"})

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = RestPasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "If the email exists, a reset link has been sent."})
