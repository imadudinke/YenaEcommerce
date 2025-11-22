from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls,user):
        token =super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['is_staff'] = user.is_staff
        return token
    def validate(self,attrs):
        data=super().validate(attrs)

        data['user'] = {
            "id": self.user.id,
            "email": self.user.email,
            "full_name": self.user.full_name,
            "is_staff": self.user.is_staff
        }
        return data
