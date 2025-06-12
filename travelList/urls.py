from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='travelList'),
    path('region/<int:pk>/', views.region_post_list, name='region_post_list'),
]