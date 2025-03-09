from django.urls import path
from . import views

urlpatterns = [
    path('pages/', views.PageListCreateView.as_view(), name='page-list-create'),
    path('pages/<int:id>/', views.PageRetrieveUpdateDestroyView().as_view(), name='page-retrieve-update'),
    path('pages/<int:page_id>/save-content/', views.save_grapesjs_content, name='save-grapesjs-content'),
]