
from rest_framework import serializers
from .models import Page

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at'] # Les champs en lecture seule