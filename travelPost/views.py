from django.shortcuts import render, redirect

def index(request):
    if not hasattr(request, 'user') or str(request.user) == 'AnonymousUser':
        return redirect('/login/')

    return render(request, 'travelPost/travelPost.html')

def temp(request):
    return render(request, 'travelPostTemp/travelPostTemp.html')

def select_local(request):
    return render(request, 'travelLocalSelect/travelLocalSelect.html')