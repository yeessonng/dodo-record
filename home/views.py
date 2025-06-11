from django.shortcuts import render, redirect
from accounts.utils import get_user_from_access_token  # account 앱에 만들었다면

def home_view(request):
    access_token = request.COOKIES.get('access')

    if not access_token:
        return redirect('/login/')

    try:
        user = get_user_from_access_token(access_token)
    except Exception:
        return redirect('/login/')

    return render(request, 'home/home.html', {'user': user})
