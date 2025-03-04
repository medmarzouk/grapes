from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError, NotAuthenticated
from django.utils.text import slugify
from .models import Page
from .serializers import PageSerializer

class PageListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des pages.
    Seuls les utilisateurs authentifiés (avec JWT) peuvent accéder à cette vue.
    """
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si l'utilisateur n'est pas authentifié, on lève une exception
        if not user or not user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
        return Page.objects.filter(user=user)

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title', '')
        slug = slugify(title)
        # Vérifie si un slug identique existe déjà pour cet utilisateur
        if Page.objects.filter(user=self.request.user, slug=slug).exists():
            raise ValidationError({'slug': 'This slug already exists for this user.'})
        serializer.save(user=self.request.user, slug=slug)


class PageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour et supprimer une page spécifique.
    Seuls les utilisateurs authentifiés peuvent accéder à cette vue.
    """
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'  # Use 'id' instead of 'pk'

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
        return Page.objects.filter(user=user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_grapesjs_content(request, page_id):
    """
    Vue pour sauvegarder le contenu édité via GrapesJS.
    Met à jour le HTML, CSS, composants et styles de la page identifiée par 'page_id'.
    """
    user = request.user
    if not user or not user.is_authenticated:
        return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        page = Page.objects.get(id=page_id, user=user)
    except Page.DoesNotExist:
        return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)

    page.html = request.data.get('html', '')
    page.css = request.data.get('css', '')
    page.components = request.data.get('components', {})
    page.styles = request.data.get('styles', {})
    page.save()

    return Response({'status': 'success'}, status=status.HTTP_200_OK)

