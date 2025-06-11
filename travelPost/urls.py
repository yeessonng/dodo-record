from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='travelPost'),
    path('Temp/', views.temp, name='travelPostTemp'),
    path('selectLocal/', views.select_local, name='travelSelectLocal'),

]