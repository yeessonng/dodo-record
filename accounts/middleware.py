from django.shortcuts import redirect
from .utils import get_user_from_access_token  # 쿠키에서 유저 뽑는 함수
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

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
    # 유진
    '/travelList',
    '/travelList/',
    '/travelPost',
    '/travelPost/'

]
#모든 요청이 들어올 때 마다 쿠키에 access 토큰이 유효한지 확인 후, user 등록
class JWTAuthenticationMiddleware:
    # 서버가 처음 켜질 때 장고가 이 미들웨어를 등록하면서 한 번만 실행됨.
    def __init__(self, get_response):
        self.get_response = get_response

    # 요청이 올 때마다 실행됨. 주소 요청 시에 해당 함수가 제일 먼저 실행된다.
    def __call__(self, request):
        path = request.path

        # 예외 경로는 검사 안 함
        if any(path.startswith(p) for p in EXCLUDE_PATHS):
            return self.get_response(request)

        access_token = request.COOKIES.get('access')
        refresh_token = request.COOKIES.get('refresh')

        #쿠키에 access 토큰 없으면 로그인 페이지로 리다이렉트
        if not access_token:
            return redirect('/login/')
        # 토큰 있으면 유저 정보 꺼냄
        try:
            user = get_user_from_access_token(access_token)
            request.user = user # !!!뷰에서 request.user로 접근 가능!!!
        except Exception:
            # access 만료 → refresh로 재발급 시도
            if refresh_token:
                try:
                    refresh = RefreshToken(refresh_token)
                    #새 access토큰 생성
                    new_access = str(refresh.access_token)

                    request.user = get_user_from_access_token(new_access)

                    response = self.get_response(request)
                    response.set_cookie(
                        key='access',
                        value=new_access,
                        httponly=True,
                        secure=False,
                        samesite='Lax',
                    )
                    return response
                except TokenError:
                    return redirect('/login/')

            else:
                return redirect('/login/')

        return self.get_response(request)
