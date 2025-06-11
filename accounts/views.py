from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({'detail': '로그인 실패'}, status=status.HTTP_401_UNAUTHORIZED)

        # 토큰 생성
        data = serializer.validated_data
        access = data.get("access")
        refresh = data.get("refresh")

        # 응답 생성 + 쿠키 설정
        response = Response({"message": "로그인 성공"}, status=status.HTTP_200_OK)
        response.set_cookie(
            key="access",
            value=access,
            httponly=True,
            secure=False,  # 배포 시 True
            samesite="Lax"
        )
        response.set_cookie(
            key="refresh",
            value=refresh,
            httponly=True,
            secure=False,  # 배포 시 True
            samesite="Lax"
        )
        return response

def refresh_token_view(request):
    refresh_token = request.COOKIES.get('refresh')

    if not refresh_token:
        return JsonResponse({'error': 'Refresh token not found'}, status=401)

    try:
        token = RefreshToken(refresh_token)
        access_token = str(token.access_token)

        response = JsonResponse({'message': 'Access token refreshed'})
        # 새 access토큰을 HttpOnly 쿠키로 전달
        response.set_cookie(
            key='access',
            value=access_token,
            httponly=True,
            secure=False,  # 프로덕션이면 True (HTTPS만)
            samesite='Lax',
            max_age=3600  # 1시간
        )
        return response
    except TokenError:
        return JsonResponse({'error': 'Invalid refresh token'}, status=401)