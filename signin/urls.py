from django.urls import path
from .views import signup_page, check_id

urlpatterns = [
    path('signup/', signup_page),
    path('check-id/', check_id, name='check_id')
]