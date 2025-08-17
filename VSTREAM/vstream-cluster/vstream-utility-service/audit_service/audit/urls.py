from django.urls import path
from .views import log_request, get_last_entries

urlpatterns = [
    path('log/', log_request, name='log_request'),
    path('get_last_entries/', get_last_entries, name='get_last_entries'),
]
