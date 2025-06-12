from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from signin.models import User

def get_user_from_access_token(token):
    try:
        access = AccessToken(token) #유효하냐?
        user_id = access['user_id']  #payload에서 추출 - user pk
        user = User.objects.get(id=user_id)
        return user #토큰 user 추출
    except Exception:
        raise AuthenticationFailed("유효하지 않은 토큰입니다.")
