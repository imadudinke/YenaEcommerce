
from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.x
BASE_DIR = Path(__file__).resolve().parent.parent
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5000),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": os.getenv("SECRET_KEY", "insecure-fallback"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-e1-!krt^=mfo9xlu4_wayt3ka)izjx-wgktiyw4q$=_ck1gko+'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

CHAPA_SECRET_KEY = os.getenv("CHAPA_SECRET_KEY")
CHAPA_CALLBACK_URL = os.getenv("CHAPA_CALLBACK_URL")
CHAPA_RETURN_URL = os.getenv("CHAPA_RETURN_URL")
MAILERSEND_API_KEY = os.getenv("MAILERSEND_API_KEY")
ALLOWED_HOSTS_ORIGIN = os.getenv("ALLOWED_HOSTS_ORIGIN")

# Helper to parse comma-separated origin lists from env safely
def _parse_origins(env_value, default=None):
    if not env_value:
        return default or []
    # split and strip, ignore empty
    cleaned = []
    for raw in env_value.split(','):
        s = raw.strip()
        if not s:
            continue
        # remove surrounding quotes if present
        if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
            s = s[1:-1]
        # remove trailing slashes for consistency
        s = s.rstrip('/')
        if s:
            cleaned.append(s)
    return cleaned

# Default development origins
DEFAULT_FRONTEND_ORIGINS = [ALLOWED_HOSTS_ORIGIN]

# Populate ALLOWED_HOSTS from an env var or sensible defaults for dev
ALLOWED_HOSTS = _parse_origins(os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1"))

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "rest_framework",
    "accounts",
    "products",
    "carts",
    "order",
    "home",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "anymail"

]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

AUTH_USER_MODEL = "accounts.User"

ROOT_URLCONF = 'core.urls'

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = _parse_origins(ALLOWED_HOSTS_ORIGIN, DEFAULT_FRONTEND_ORIGINS)

# CSRF_TRUSTED_ORIGINS must be full origins (scheme://host). Use same list as CORS by default.
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

SESSION_COOKIE_SAMESITE = "Lax"

CSRF_COOKIE_SAMESITE = "Lax"

SESSION_COOKIE_SECURE = False

CSRF_COOKIE_SECURE = False

SESSION_ENGINE = "django.contrib.sessions.backends.db"


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Media files (user-uploaded)
MEDIA_URL = '/media/'
# Store uploads at project root (BASE_DIR) so existing folders like 'product_images/' continue to work
MEDIA_ROOT = BASE_DIR

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK={
    "DEFAULT_AUTHENTICATION_CLASSES":(
        "accounts.authentication.JWTAuthenticationFromCookie",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
     'DEFAULT_PAGINATION_CLASS': 'core.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

sANYMAIL = {
    "MAILERSEND_API_TOKEN": MAILERSEND_API_KEY,
}
