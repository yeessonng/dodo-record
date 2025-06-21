from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Post
from .models import Region, Subregion

def create_post(request):
    if not request.user.is_authenticated:
        return redirect('/login/')

    if request.method == 'POST':
        title = request.POST.get('title')
        body = request.POST.get('body')
        icon = request.POST.get('icon')
        status = request.POST.get('status') == 'true'  # True면 최종 저장, False면 임시 저장

        Post.objects.create(
            user=request.user,
            title=title,
            body=body,
            icon=icon,
            status=status,
        )
        # 임시 저장 후 또는 최종 저장 후 둘 다 임시 글 목록 페이지로 보내기
        return redirect('travelPostTemp')

    return render(request, 'travelPost/travelPost.html')


def temp(request):
    if not request.user.is_authenticated:
        return redirect('/login/')

    # 임시 저장된 글들만 가져오기
    temp_posts = Post.objects.filter(user=request.user, status=False).order_by('-created_at')
    return render(request, 'travelPostTemp/travelPostTemp.html', {'temp_posts': temp_posts})


def temp_posts(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': '로그인 필요'}, status=401)

    print(f"temp_posts called by user: {request.user}")

    temp_posts_qs = Post.objects.filter(user=request.user, status=False).order_by('-created_at')
    print(f"Found {temp_posts_qs.count()} temp posts")

    posts_data = []
    for post in temp_posts_qs:
        print(f"Processing post id={post.id} title={post.title}")
        region_data = [
            {
                'region': ps.subregion.region.region,
                'subregion': ps.subregion.subregion
            }
            for ps in post.post_subregions.all()
        ]
        image_urls = [img.image_url for img in post.images.all()]
        posts_data.append({
            'id': post.id,
            'title': post.title,
            'created_at': post.created_at.strftime('%Y-%m-%d %H:%M'),
            #'region': region_data,
            'icon': post.icon,
            'body': post.body,
            'image_urls': image_urls,
        })

    return JsonResponse({'posts': posts_data})


def temp_page(request):
    if not request.user.is_authenticated:
        return redirect('/login/')
    return render(request, 'travelPostTemp/travelPostTemp.html')


def select_local(request):
    if not request.user.is_authenticated:
        return redirect('/login/')

    regions = Region.objects.all()
    subregions = Subregion.objects.all()
    return render(request, 'travelLocalSelect/travelLocalSelect.html', {
        'regions': regions,
        'subregions': subregions
    })