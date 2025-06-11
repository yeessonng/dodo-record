from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='travelList_index'),  # 기본 페이지 예: /travelList/
    # 필요한 추가 경로들 작성
]