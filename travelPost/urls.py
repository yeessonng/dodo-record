from django.urls import path
from . import views

urlpatterns = [

    # 여행 기록 글쓰기 (저장, 임시저장)
    path('', views.create_post, name='travelPost'),

    # 임시저장 목록 불러오기

    path('tempList/', views.temp_posts, name='temp_posts_api'),
    path('Temp/', views.temp_page, name='temp_page'),
    # path('Temp/', views.temp, name='travelPostTemp'),

    # 지역 선택
    path('selectLocal/', views.select_local, name='travelSelectLocal'),

]