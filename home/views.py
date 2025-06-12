from django.shortcuts import render, redirect
from accounts.utils import get_user_from_access_token
from travelPost.models import Post

def home_view(request):
    user = request.user

    posts = Post.objects.filter(user=user)

    count_by_region = {}
    for post in posts:
        subregions = post.post_subregions.all()
        for ps in subregions:
            region_id = ps.subregion.region.id
            count_by_region[region_id] = count_by_region.get(region_id, 0) + 1

    return render(request, 'home/home.html', {
        'count_by_region': count_by_region
    })
