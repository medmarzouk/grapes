# from langchain_mistralai import ChatMistralAI
# from langchain.chains import LLMChain
# from langchain_core.prompts import PromptTemplate
# from django.conf import settings

# def get_mistral_response(prompt):
#     llm = ChatMistralAI(
#         model="mistral-large-latest",
#         temperature=0.7,
#         api_key=settings.MISTRAL_API_KEY
#     )
    
#     template = """Tu es un ingénieur en développement logiciel spécialisé dans la création d'applications web.

# Question: {question}
# """
#     prompt_template = PromptTemplate(
#         template=template,
#         input_variables=["question"]
#     )
    
#     chain = LLMChain(llm=llm, prompt=prompt_template)
#     return chain.run(question=prompt)

from langchain_mistralai import ChatMistralAI
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from django.conf import settings

def get_mistral_response(prompt):
    """
    Interroge le modèle Mistral via LangChain pour obtenir une réponse au prompt fourni.
    """
    llm = ChatMistralAI(
        model="mistral-large-latest",
        temperature=0.7,
        api_key=settings.MISTRAL_API_KEY
    )
    
    template = (
        "Tu es un ingénieur en développement logiciel spécialisé dans la création d'applications web.\n\n"
        "Question: {question}\n"
    )
    prompt_template = PromptTemplate(
        template=template,
        input_variables=["question"]
    )
    
    chain = LLMChain(llm=llm, prompt=prompt_template)
    return chain.run(question=prompt)

def get_mistral_design_response(prompt, design_type="react"):
    """
    Wrapper pour interroger le modèle dans un contexte de conversion de design.
    Pour l'instant, il se contente d'appeler get_mistral_response.
    """
    return get_mistral_response(prompt)

def detect_input_type(input_text):
    """
    Détecte le type d'input fourni :
      - Retourne "html_css" si le texte contient des balises (ex. XML, HTML)
      - Retourne "text" sinon
    """
    if "<" in input_text and ">" in input_text:
        return "html_css"
    return "text"

def convert_design_to_react(input_text):
    """
    Convertit un design fourni (sous forme de code ou description) en composant React.
    La fonction :
      1. Détecte le type d'input via detect_input_type
      2. Construit un prompt personnalisé en fonction du type détecté
      3. Appelle get_mistral_design_response pour obtenir la conversion
    """
    input_type = detect_input_type(input_text)
    
    if input_type == "text":
        # Cas d'une description textuelle
        prompt = f"""
        Voici une description détaillée d'un design d'interface:
        
        {input_text}
        
        Transforme cette description en un composant React moderne qui:
        1. Respecte EXACTEMENT toutes les spécifications visuelles décrites
        2. Utilise les Hooks React et les meilleures pratiques
        3. Implémente toute l'interactivité mentionnée
        4. Est responsive et bien structuré
        5. Inclut des styles détaillés qui correspondent précisément au design décrit
        """
    else:
        # Cas où l'input est du code (par exemple, HTML, XML, etc.)
        format_names = {
            "html_css": "HTML/CSS",
            "winform": "Windows Forms (C#)",
            "xml": "XML",
            "xaml": "XAML (WPF)",
            "android_xml": "Android XML",
            "react": "React"
        }
        format_name = format_names.get(input_type, input_type.upper())
        prompt = f"""
        Voici du code au format {format_name}:
        
        {input_text}
        
        Convertis ce code en un composant React moderne qui:
        1. Reproduit EXACTEMENT le même design visuel que l'original
        2. Préserve toutes les couleurs, tailles, espacements et proportions
        3. Maintient la même structure et hiérarchie des éléments
        4. Implémente toutes les fonctionnalités et l'interactivité présentes
        5. Utilise styled-components ou CSS-in-JS pour reproduire fidèlement les styles
        6. Incorpore les React Hooks appropriés
        
        Le résultat doit être visuellement identique à l'original, juste implémenté en React.
        """
    
    return get_mistral_design_response(prompt, design_type="react")
