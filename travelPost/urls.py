from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='travelPost'),
    path('Temp', views.index, name='travelPostTemp'),

]