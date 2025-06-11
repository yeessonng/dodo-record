from django.urls import path
from .views import CustomTokenObtainPairView, refresh_token_view
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/refresh-cookie/', refresh_token_view, name='refresh_cookie'),
]
