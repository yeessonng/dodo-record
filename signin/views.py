from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import User
import json

# Create your views here.
def signup_page(request):
    if request.method == 'POST':
        username = request.POST.get('uid') #input의 name 속성으로 데이터를 받아 옴
        password = request.POST.get('pwd')

        if User.objects.filter(user_id=username).exists():
            messages.error(request, '이미 존재하는 아이디입니다.')
            return redirect('/signup/')

        User.objects.create(user_id=username, pw=password)
        messages.success(request, '회원가입 성공!')
        return redirect('/login/') #로그인 경로 매핑

    return render(request, 'signin/signin.html')

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
            if user.pw == password:
                # 로그인 성공 시
                return redirect('/home/')  # url 수정 필요
            else:
                messages.error(request, '아이디 또는 비밀번호가 틀렸습니다')
        except User.DoesNotExist:
            messages.error(request, '아이디 또는 비밀번호가 틀렸습니다')

    return render(request, 'login/login.html')  # GET 요청 or 실패 시