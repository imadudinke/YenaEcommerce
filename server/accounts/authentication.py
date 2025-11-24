
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

User = get_user_model()

class JWTAuthenticationFromCookie(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('access') 
        if not token:
            return None 

        try:
            signing_key = getattr(settings, "SIMPLE_JWT", {}).get("SIGNING_KEY", settings.SECRET_KEY)
            payload = jwt.decode(token, signing_key, algorithms=["HS256"])
            
            
            user_id = payload.get('user_id') or payload.get('id')  
            if user_id is None:
                raise exceptions.AuthenticationFailed('User identifier not found in JWT payload')

            user = User.objects.get(id=user_id,is_active=True)
         
            return (user, token) 

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found')
        except Exception as e:
                       raise exceptions.AuthenticationFailed(f'Authentication error: {str(e)}')

