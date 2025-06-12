from django.shortcuts import render, redirect
from .models import Post
from .models import Region, Subregion

def index(request):
    if not hasattr(request, 'user') or str(request.user) == 'AnonymousUser':
        return redirect('/login/')

    return render(request, 'travelPost/travelPost.html')

def temp(request):
    if not request.user.is_authenticated:
        return redirect('/login/')

    print("request.user =", request.user)
    print("type(request.user) =", type(request.user))

    temp_posts = Post.objects.filter(user=request.user, status=False).order_by('-created_at')

    return render(request, 'travelPostTemp/travelPostTemp.html', {
        'temp_posts': temp_posts
    })

def select_local(request):
    if not request.user.is_authenticated:
        return redirect('/login/')

    regions = Region.objects.all()
    subregions = Subregion.objects.all()
    return render(request, 'travelLocalSelect/travelLocalSelect.html', {
        'regions': regions,
        'subregions': subregions
    })