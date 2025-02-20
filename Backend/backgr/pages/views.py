
from rest_framework import generics, permissions
from .models import Page
from .serializers import PageSerializer
from django.utils.text import slugify
from rest_framework.exceptions import ValidationError

class PageListCreateView(generics.ListCreateAPIView):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]  # Seuls les utilisateurs connectés peuvent accéder

    def get_queryset(self):
        """Retourne uniquement les pages de l'utilisateur courant."""
        return Page.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Enregistre la page avec l'utilisateur courant et génère le slug."""
        title = serializer.validated_data['title']
        slug = slugify(title)
        # Vérifie si un slug existe déjà pour cet utilisateur
        if Page.objects.filter(user=self.request.user, slug=slug).exists():
            raise ValidationError({'slug': 'This slug already exists for this user.'})

        serializer.save(user=self.request.user, slug=slug)


class PageRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Retourne uniquement les pages de l'utilisateur courant."""
        return Page.objects.filter(user=self.request.user)


    def perform_update(self, serializer):
        """Met à jour la page."""
        serializer.save()