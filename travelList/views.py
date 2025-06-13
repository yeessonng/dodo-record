from django.shortcuts import render, get_object_or_404
from travelPost.models import Region, Post

def index(request):
    return render(request, 'travelList/travelList.html')

def region_post_list(request, pk):
    region = get_object_or_404(Region, pk=pk)  # region 변수 선언
    return render(request, 'travelList/travelList.html', {'region_name': region.region})

def detail(request):
    if not request.user.is_authenticated:
        return redirect('/login/')

    region = request.GET.get('region')
    print("region:", region)

    return render(request, 'travelPostTemp/travelPostTemp.html')