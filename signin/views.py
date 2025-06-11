from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
import json

# Create your views here.
def signup_page(request):
    if request.method == 'POST':
        username = request.POST.get('uid') #input의 name 속성으로 데이터를 받아 옴
        password = request.POST.get('pwd')

        if User.objects.filter(user_id=username).exists():
            return redirect('/signup/')

        User.objects.create(user_id=username, pw=password)
        return redirect('/login/') #로그인 경로 매핑

    return render(request, 'signin/signin.html')

#아이디 중복 체크
def check_id(request):
    if request.method == 'POST': #요청 방식이 post일 때만 처리함
        data = json.loads(request.body)
        user_id = data.get('user_id', '') #user_id 꺼내오고 없으면 빈 문자열
        exists = User.objects.filter(user_id=user_id).exists() #t/f
        return JsonResponse({'exists': exists})
    return JsonResponse({'error': 'POST only'}, status=400)

def login_view(request):
    if request.method == 'POST':
        user_id = request.POST.get('uid')
        password = request.POST.get('pwd')

        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return render(request, 'login/login.html', {'error': '존재하지 않는 사용자입니다'})

        if user.pw != password:
            return render(request, 'login/login.html', {'error': '비밀번호가 틀렸습니다'})

        refresh = RefreshToken.for_user(user)
        response = redirect('/home/')  # 로그인 성공 후 이동할 페이지
        response.set_cookie('access', str(refresh.access_token), httponly=True, samesite='Lax')
        response.set_cookie('refresh', str(refresh), httponly=True, samesite='Lax')
        return response

    return render(request, 'login/login.html')