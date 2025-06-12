from django.shortcuts import render

def index(request):
    return render(request, 'travelList/travelList.html')

def region_post_list(request, pk):
    return render(request, 'travelList/travelList.html', {'region_id': pk})