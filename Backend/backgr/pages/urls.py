from django.urls import path
from . import views

urlpatterns = [
    path('pages/', views.PageListCreateView.as_view(), name='page-list-create'),
    path('pages/<int:pk>/', views.PageRetrieveUpdateView.as_view(), name='page-retrieve-update'),
]