from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='travelPost_index'),  # 기본 페이지 예: /travelPost/
]