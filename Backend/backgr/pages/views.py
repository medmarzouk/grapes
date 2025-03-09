from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError, NotAuthenticated
from django.utils.text import slugify
from django.http import JsonResponse
from .models import Page
from .serializers import PageSerializer
import json

class PageListCreateView(generics.ListCreateAPIView):
    """
    View for listing and creating pages.
    Only authenticated users (with JWT) can access this view.
    """
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # If user is not authenticated, raise an exception
        if not user or not user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
        return Page.objects.filter(user=user)
    
    def perform_create(self, serializer):
        title = serializer.validated_data.get('title', '')
        slug = slugify(title)
        # Check if identical slug already exists for this user
        if Page.objects.filter(user=self.request.user, slug=slug).exists():
            raise ValidationError({'slug': 'This slug already exists for this user.'})
        serializer.save(user=self.request.user, slug=slug)

class PageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    View for retrieving, updating and deleting a specific page.
    Only authenticated users can access this view.
    """
    serializer_class = PageSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'  # Use 'id' instead of 'pk'
    
    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            raise NotAuthenticated("Authentication credentials were not provided.")
        return Page.objects.filter(user=user)
    
@api_view(['POST', 'GET'])
@permission_classes([permissions.IsAuthenticated])
def save_grapesjs_content(request, page_id):
    """
    View for saving content edited via GrapesJS.
    Updates HTML, CSS, components and styles of the page identified by 'page_id'.
    GET method returns the current page content for GrapesJS.
    POST method saves the content sent by GrapesJS.
    """
    user = request.user
    if not user or not user.is_authenticated:
        return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        page = Page.objects.get(id=page_id, user=user)
    except Page.DoesNotExist:
        return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Handle GET request for GrapesJS loading content
    if request.method == 'GET':
        # Ensure we're returning valid JSON for the components and styles fields
        components = page.components
        styles = page.styles
        
        # Check if components and styles are already strings
        if not isinstance(components, str) and components is not None:
            try:
                components = json.dumps(components)
            except Exception as e:
                components = '{}'
        
        if not isinstance(styles, str) and styles is not None:
            try:
                styles = json.dumps(styles)
            except Exception as e:
                styles = '{}'
        
        return Response({
            'html': page.html or '',
            'css': page.css or '',
            'components': components or '{}',
            'styles': styles or '{}'
        })
    
    # Handle POST request for saving content
    page.html = request.data.get('html', '')
    page.css = request.data.get('css', '')
    
    # Handle the JSON fields properly
    try:
        components_data = request.data.get('components', '{}')
        # Ensure we have a string to parse
        if not isinstance(components_data, str):
            components_data = json.dumps(components_data)
        
        # Validate that it's parseable JSON
        json.loads(components_data)  # Just to validate, we'll store as string
        
        styles_data = request.data.get('styles', '{}')
        # Ensure we have a string to parse
        if not isinstance(styles_data, str):
            styles_data = json.dumps(styles_data)
        
        # Validate that it's parseable JSON
        json.loads(styles_data)  # Just to validate, we'll store as string
        
        # Store the data
        page.components = components_data
        page.styles = styles_data
        
        page.save()
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    except json.JSONDecodeError as e:
        return Response({
            'error': f'Invalid JSON data: {str(e)}',
            'components_data_type': type(request.data.get('components', '{}')),
            'styles_data_type': type(request.data.get('styles', '{}'))
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'Error saving content: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)