from django.shortcuts import render, get_object_or_404, redirect, reverse
from travelPost.models import Region, Post

def index(request):
    return render(request, 'travelList/travelList.html')

def region_post_list(request, pk):
    region = get_object_or_404(Region, pk=pk)  # region 변수 선언
    post_id = request.GET.get('postId')
    if post_id:
        url = reverse('detail', kwargs={'pk': pk}) + f'?postId={post_id}'
        return redirect(url)  # redirect에 완성된 URL 문자열을 넘겨야 함

    return render(request, 'travelList/travelList.html', {'region_name': region.region})

def detail(request, pk):
    post = get_object_or_404(Post, pk=pk)

    post_data = {
        'id': post.id,
        'title': post.title,
        # 'region': post.region,
        'districts': post.districts if hasattr(post, 'districts') else [],
        'photos': post.photos if hasattr(post, 'photos') else [],
        'icon': post.icon,
        'body': post.body,
    }

    return render(request, 'travelListDetail/travelListDetail.html', {'post': post_data})