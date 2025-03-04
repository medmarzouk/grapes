# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from .serializers import PromptSerializer
# from django.conf import settings
# from .llm import get_mistral_response

# class ChatView(APIView):
#     # Pour activer l’authentification JWT, décommentez la ligne ci-dessous
#     permission_classes = [IsAuthenticated]
#     # permission_classes = []  # ou [IsAuthenticated] si vous souhaitez restreindre l’accès

#     def post(self, request):
#         serializer = PromptSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 prompt_text = serializer.validated_data['prompt']

#                 # Vérifier que l’API key Mistral est configurée
#                 mistral_api_key = settings.MISTRAL_API_KEY
#                 if not mistral_api_key:
#                     return Response(
#                         {"error": "Mistral API key not configured"},
#                         status=status.HTTP_500_INTERNAL_SERVER_ERROR
#                     )

#                 # Appel de la fonction qui interroge LangChain avec Mistral
#                 response = get_mistral_response(prompt_text)

#                 return Response({"response": response}, status=status.HTTP_200_OK)

#             except Exception as e:
#                 return Response(
#                     {"error": str(e)},
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR
#                 )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from .serializers import PromptSerializer
from .llm import get_mistral_response, convert_design_to_react

class ChatView(APIView):
    # Active l'authentification (JWT par exemple)
    # permission_classes = [IsAuthenticated]
    permission_classes = []

    def post(self, request):
        serializer = PromptSerializer(data=request.data)
        if serializer.is_valid():
            try:
                prompt_text = serializer.validated_data['prompt']

                # Vérifier si l'input contient des balises (ex. XML ou HTML) pour détecter un design
                if "<" in prompt_text and ">" in prompt_text:
                    # Conversion du design en composant React
                    response_text = convert_design_to_react(prompt_text)
                else:
                    # Sinon, on traite le prompt comme une question classique
                    response_text = get_mistral_response(prompt_text)

                return Response({"response": response_text}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
