from rest_framework import serializers
from django.core.mail import send_mail 
from django.conf import settings 
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
User=get_user_model()

class RestPasswordSerializer(serializers.Serializer):

    email=serializers.EmailField()

    def validate_email(self,value):
        try:
            user=User.objects.get(email=value)
        except User.DoesNotExist:
            pass
        return value
    def save(self):
        request = self.context.get("request")
        email = self.validated_data["email"]

        user=User.objects.filter(email=email).first()

        if not user:
            return
        
        uid = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)

        reset_link = f"{request.build_absolute_uri('/')}reset-password/{uid}/{token}"

       

        print("RESET LINK:", reset_link)

        return reset_link
     
class PasswordRestConfirmSerializer(serializers.Serializer):

    password=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)
    uid=serializers.CharField(write_only=True)
    token=serializers.CharField(write_only=True)

    def validate(self,attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        try:
            user_id=urlsafe_base64_decode(attrs["uid"]).decode()
            user=User.objects.get(id=user_id)

        except Exception:
             raise serializers.ValidationError({"uid": "Invalid UID"})
        if not PasswordResetTokenGenerator().check_token(user,attrs["token"]):
             raise serializers.ValidationError({"token": "Invalid or expired token"})
        validate_password(attrs["password"])
        attrs["user"]=user
        return attrs
    
    def save(self):
        
        user = self.validated_data["user"]
        password = self.validated_data["password"]
        user.set_password(password)
        user.save()
        return user



