from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='travelList'),
    path('region/<int:pk>/', views.region_post_list, name='region_post_list'),

    path('region/<int:pk>/detail/', views.detail, name='detail'),

    #path('travel/<int:post_id>/', views.travel_list_detail, name='travel_detail'),

]