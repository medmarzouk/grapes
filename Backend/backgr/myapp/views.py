from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
import random
import string
from django.utils import timezone
from datetime import timedelta

class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token),
                          "access": str(token.access_token)}
        return Response(data, status=status.HTTP_201_CREATED)


class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token),  
                          "access": str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)
    
class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer
    
    def get_object(self):
        return self.request.user
class PasswordResetRequestAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetRequestSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            email = serializer.validated_data['email']
            
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response({'error': 'Aucun utilisateur avec cet email'}, status=status.HTTP_404_NOT_FOUND)
            
            reset_code = ''.join(random.choices(string.digits, k=6))
            user.reset_code = reset_code
            user.reset_code_expiration = timezone.now() + timedelta(minutes=15)
            user.save()
            
            # Envoi du mail
            send_mail(
                'Réinitialisation de mot de passe',
                f'Votre code de réinitialisation est : {reset_code}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            
            return Response({'detail': 'Code envoyé par email'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Erreur serveur: {str(e)}")
            return Response({'error': 'Erreur lors du traitement'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class PasswordResetConfirmAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetConfirmSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = CustomUser.objects.get(
                email=serializer.validated_data['email'],
                reset_code=serializer.validated_data['reset_code'],
                reset_code_expiration__gt=timezone.now()
            )
        except CustomUser.DoesNotExist:
            return Response({'error': 'Code invalide ou expiré'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.reset_code = None
        user.reset_code_expiration = None
        user.save()
        
        return Response({'detail': 'Mot de passe réinitialisé avec succès'}, status=status.HTTP_200_OK)   