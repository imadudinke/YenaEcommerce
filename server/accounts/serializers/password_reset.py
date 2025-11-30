from rest_framework import serializers
from django.core.mail import send_mail 
from mailersend import MailerSendClient, EmailBuilder 
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

        api_key = settings.MAILERSEND_API_KEY
        ms = MailerSendClient(api_key=api_key) # Initialize client with API key

        subject = "Password Reset Request for Your Account"
        html_body = f"<p>Hello {user.full_name or user.email},</p><p>Please use the link below to set a new password:</p><a href='{reset_link}'>{reset_link}</a>"
        text_body = f"Hello {user.full_name or user.email},\n\nPlease use the link below to set a new password:\n{reset_link}"

        email_message = (
            EmailBuilder()
            .from_email("imadudinkeremu@gmail.com") 
            .to_many([{"email": user.email, "name": user.full_name or user.email}]) 
            .subject(subject)
            .html(html_body)
            .text(text_body)
            .build()
        )

        try:
            response = ms.emails.send(email_message) 
            print(f"Email sent successfully: {response.message_id}")
        except Exception as e:
            print(f"MailerSend SDK Error: {e}")
            raise serializers.ValidationError("Email service temporarily unavailable.")


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



