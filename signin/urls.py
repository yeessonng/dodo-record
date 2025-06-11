from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('login/', TemplateView.as_view(template_name='login/login.html'), name='login'),
    path('signup/', views.signup_page, name='signup'), #name 사용하면 역참조 가능
    path('check-id/', views.check_id, name='check_id')
]