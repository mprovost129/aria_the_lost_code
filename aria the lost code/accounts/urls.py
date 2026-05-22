from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('subscribe/',          views.paywall,       name='paywall'),
    path('subscribe/waitlist/', views.waitlist_join,  name='waitlist_join'),
]
