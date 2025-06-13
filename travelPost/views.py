from django.shortcuts import render, redirect
from .models import Post
from .models import Region, Subregion

def create_post(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect('/login/')

        # HTML form에서 전달된 값 추출
        title = request.POST.get('title')
        body = request.POST.get('body')
        icon = request.POST.get('icon')
        status = request.POST.get('status') == 'true'  # 임시저장 여부 등

        # Post 생성 및 저장
        post = Post.objects.create(
            user=request.user,
            title=title,
            body=body,
            icon=icon,
            status=status,
        )

        # 저장 성공 후 리다이렉트 (예: 임시저장 목록으로)
        return redirect('travelPostTemp')

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