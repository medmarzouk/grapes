
# from django.db import models
# from django.conf import settings
# from myapp.models import CustomUser
# class Page(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     title = models.CharField(max_length=200)
#     slug = models.SlugField(unique=True)
#     content = models.TextField(null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.title
from django.db import models
from django.conf import settings
from myapp.models import CustomUser
from django.utils.text import slugify

class Page(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField(null=True, blank=True)
    html = models.TextField(null=True, blank=True)  # Store GrapesJS HTML
    css = models.TextField(null=True, blank=True)   # Store GrapesJS CSS
    components = models.JSONField(null=True, blank=True)  # Store GrapesJS components
    styles = models.JSONField(null=True, blank=True)      # Store GrapesJS styles
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title