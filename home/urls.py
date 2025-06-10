from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'), #name 사용하면 역참조 가능
]