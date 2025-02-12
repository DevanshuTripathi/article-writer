from django.urls import path

from . import views

urlpatterns = [
    path('generate/', views.generate, name="generate"),
    path('optimize/', views.optimize, name="optimize")
]