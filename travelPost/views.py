from django.shortcuts import render

def index(request):
    return render(request, 'travelPost/travelPost.html')

def temp(request):
    return render(request, 'travelPostTemp/travelPostTemp.html')