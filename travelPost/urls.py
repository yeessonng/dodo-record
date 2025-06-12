from django.urls import path
from . import views

urlpatterns = [

    # 여행 기록 글쓰기
    path('', views.index, name='travelPost'),

    # 임시저장
    path('Temp/', views.temp, name='travelPostTemp'),

    # 지역 선택
    path('selectLocal/', views.select_local, name='travelSelectLocal'),

]