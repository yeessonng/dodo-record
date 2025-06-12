from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from signin.models import User

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user_id = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed("존재하지 않는 사용자입니다.")

        if not check_password(password, user.pw):  # 해싱된 비밀번호 비교
            raise AuthenticationFailed("비밀번호가 틀렸습니다.")

        # 직접 토큰 생성
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
