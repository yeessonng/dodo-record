from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'), #name 사용하면 역참조 가능
    path('signup/', views.signup_page, name='signup'),
    path('check-id/', views.check_id, name='check_id')
]