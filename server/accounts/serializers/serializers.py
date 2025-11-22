from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction

User=get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ("id", "email", "is_staff")
        read_only_fields = ("id", "is_staff")


class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,required=True, help_text="Use a strong password.")
    password2=serializers.CharField(write_only=True,required=True, help_text="Confirm Password.")

    class Meta:
        model=User
        fields=("email","password","password2","full_name")

    def validate_email(self,value):
        value=value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already Exists" )
        return value
    def validate(self,attrs):
        if attrs["password"]!= attrs["password2"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        validate_password(attrs["password"],user=User(**attrs))
        return attrs
    
    @transaction.atomic
    def create(self,validated_data):
        validated_data.pop("password2")
        password=validated_data.pop("password")

        user=User.objects.create_user(password=password,**validated_data)
        return user

class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password=serializers.charField(required=True,write_only=True)
    new_password=serializers.chartField(required=True,write_only=True)
    def validate_new_password(self,value):
        validate_password(value)
        return value
    
    def validate(self,attrs):
        user=self.context["request"].user
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return attrs
    
    def save(self,**kwargs):
      user=self.context["request"].user
      user.set_password(self.validated_data["new_password"])
      user.save()
      return user