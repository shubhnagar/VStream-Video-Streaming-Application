from django.urls import path
from .views import gateway_route

urlpatterns = [
    path('<str:service_action>/', gateway_route, name='gateway_route'),
    path('videos', gateway_route, {'service_action': 'fetch_videos'}),
]
