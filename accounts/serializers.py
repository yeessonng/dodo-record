from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from signin.models import User

#유저 검증, 비밀번호 해싱 비교, jwt 토큰 생성
class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField() #serializer 클래스 정의
    password = serializers.CharField()

    #로그인 시 자동으로 호출되는 함수
    #serializer.is_vaild() > 실행
    def validate(self, attrs):
        user_id = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed("존재하지 않는 사용자입니다.")

        if not check_password(password, user.pw):  #해싱된 비밀번호 비교
            raise AuthenticationFailed("비밀번호가 틀렸습니다.")

        #직접 토큰 생성: pk 기준
        #user 객체를 넣으면 그 유저에 대한 토큰을 만들어 줌
        #refresh에 대응되는 access token 객체도 자동 생성
        #토큰은 실제로는 python 객체기 때문에 문자열로 바꿔줌
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
