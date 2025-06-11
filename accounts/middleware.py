from django.shortcuts import redirect
from .utils import get_user_from_access_token  # 쿠키에서 유저 뽑는 함수

# 인증 예외 처리할 경로
EXCLUDE_PATHS = [
    '/login/',
    '/signup/',
    '/api/token/',
    '/api/token/refresh/',
    '/api/token/refresh-cookie/',
    '/static/',
    '/admin/',
    '/check-id/',
    '/travelList',
    '/travelList/',
    '/travelPost',
    '/travelPost/'
]

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path

        # 예외 경로는 검사 안 함
        if any(path.startswith(p) for p in EXCLUDE_PATHS):
            return self.get_response(request)

        access_token = request.COOKIES.get('access')
        if not access_token:
            return redirect('/login/')

        try:
            user = get_user_from_access_token(access_token)
            request.user = user  # 뷰에서 request.user로 접근 가능
        except Exception:
            return redirect('/login/')

        return self.get_response(request)
