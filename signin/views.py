from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User
import json

# Create your views here.
def signup_page(request):
    return render(request, 'signin/signin.html')

@csrf_exempt
def check_id(request):
    if request.method == 'POST': #요청 방식이 post일 때만 처리함
        data = json.loads(request.body)
        user_id = data.get('user_id', '') #user_id 꺼내오고 없으면 빈 문자열
        exists = User.objects.filter(user_id=user_id).exists() #t/f
        return JsonResponse({'exists': exists})
    return JsonResponse({'error': 'POST only'}, status=400)