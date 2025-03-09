from langchain_mistralai import ChatMistralAI
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from django.conf import settings

def get_mistral_response(prompt, structured_output=False, response_schemas=None):
    """
    Interroge le modèle Mistral via LangChain pour obtenir une réponse au prompt fourni.
    Supporte optionnellement la sortie structurée si structured_output=True.
    """
    llm = ChatMistralAI(
        model="mistral-large-latest",
        temperature=0.7,
        api_key=settings.MISTRAL_API_KEY
    )
    
    if structured_output and response_schemas:
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()
        
        template = (
            "Tu es un ingénieur en développement logiciel spécialisé dans la création d'applications web.\n\n"
            "Question: {question}\n\n"
            "Format ton résultat comme suit:\n{format_instructions}"
        )
        prompt_template = PromptTemplate(
            template=template,
            input_variables=["question"],
            partial_variables={"format_instructions": format_instructions}
        )
        
        chain = LLMChain(llm=llm, prompt=prompt_template)
        response = chain.run(question=prompt)
        return output_parser.parse(response)
    else:
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

def detect_input_type(input_text):
    """
    Détecte le type d'input fourni de manière plus précise:
      - "html_css" - HTML et CSS standard
      - "html_css_js" - HTML avec CSS et JavaScript
      - "bootstrap" - HTML utilisant Bootstrap
      - "tailwind" - HTML utilisant Tailwind CSS
      - "text" - Description textuelle
    """
    # Recherche de balises HTML
    has_html = "<" in input_text and ">" in input_text
    
    # Recherche de patterns spécifiques
    has_js = "function" in input_text or "addEventListener" in input_text or "<script" in input_text
    has_bootstrap = "class=\"btn" in input_text or "class=\"container" in input_text or "bootstrap" in input_text.lower()
    has_tailwind = "class=\"flex" in input_text or "class=\"p-" in input_text or "class=\"m-" in input_text
    
    if not has_html:
        return "text"
    elif has_bootstrap:
        return "bootstrap"
    elif has_tailwind:
        return "tailwind"
    elif has_js:
        return "html_css_js"
    else:
        return "html_css"

def analyze_html_structure(input_text):
    """
    Analyse la structure HTML pour extraire des informations utiles pour la conversion:
    - éléments interactifs
    - structure des composants
    - styles principaux
    """
    # Cette fonction utiliserait LangChain pour une analyse plus poussée
    schemas = [
        ResponseSchema(name="components", description="Liste des principaux composants UI identifiés"),
        ResponseSchema(name="interactive_elements", description="Liste des éléments interactifs comme boutons, formulaires, etc."),
        ResponseSchema(name="styling_approach", description="Approche de style détectée (CSS inline, classes, etc.)")
    ]
    
    prompt = f"""
    Analyse le code HTML/CSS suivant et identifie:
    1. Les principaux composants UI qu'on pourrait créer
    2. Tous les éléments interactifs (boutons, formulaires, etc.)
    3. L'approche de style utilisée (CSS inline, classes, frameworks)
    
    Code à analyser:
    {input_text}
    """
    
    return get_mistral_response(prompt, structured_output=True, response_schemas=schemas)

def convert_design_to_react(input_text):
    """
    Convertit un design fourni (sous forme de code ou description) en composant React.
    La fonction:
      1. Détecte le type d'input de manière précise
      2. Analyse la structure pour mieux comprendre les besoins
      3. Construit un prompt personnalisé en fonction du type et de l'analyse
      4. Appelle get_mistral_design_response pour obtenir la conversion
    """
    input_type = detect_input_type(input_text)
    
    # Pour les entrées HTML, effectuer une analyse préalable
    structure_analysis = {}
    if input_type in ["html_css", "html_css_js", "bootstrap", "tailwind"]:
        structure_analysis = analyze_html_structure(input_text)
    
    # Création de prompts spécifiques selon le type d'entrée
    if input_type == "text":
        # Cas d'une description textuelle
        prompt = f"""
        Voici une description détaillée d'un design d'interface:
        
        {input_text}
        
        Transforme cette description en un composant React moderne qui:
        1. Respecte EXACTEMENT toutes les spécifications visuelles décrites
        2. Utilise les Hooks React (useState, useEffect, useCallback) pour l'interactivité
        3. Implémente toute l'interaction mentionnée avec des exemples de code fonctionnels
        4. Est responsive et bien structuré avec une approche mobile-first
        5. Utilise styled-components pour les styles
        6. Décompose l'interface en sous-composants réutilisables quand c'est pertinent
        
        Fournis un code complet et fonctionnel, avec tous les imports nécessaires et les styles détaillés.
        """
    elif input_type in ["bootstrap", "tailwind"]:
        # Cas spécifique pour les frameworks CSS
        framework = "Bootstrap" if input_type == "bootstrap" else "Tailwind CSS"
        react_equivalent = "react-bootstrap" if input_type == "bootstrap" else "Tailwind CSS directement avec React"
        
        prompt = f"""
        Voici du code HTML utilisant {framework}:
        
        {input_text}
        
        Convertis ce code en composant React qui:
        1. Reproduit EXACTEMENT le même design visuel
        2. Utilise {react_equivalent} pour maintenir la cohérence du design
        3. Ajoute de l'interactivité JavaScript en utilisant les Hooks React
        4. Transforme les fonctionnalités statiques en éléments dynamiques
        5. Décompose la structure en composants fonctionnels React
        
        Analyse particulièrement:
        - Les composants potentiels identifiés: {structure_analysis.get('components', 'à déterminer')}
        - Les éléments interactifs: {structure_analysis.get('interactive_elements', 'à déterminer')}
        
        Fournis un code complet avec imports, définitions de composants et interactions.
        """
    elif input_type == "html_css_js":
        # Cas pour HTML avec JavaScript existant
        prompt = f"""
        Voici du code HTML/CSS/JS:
        
        {input_text}
        
        Convertis ce code en un composant React moderne qui:
        1. Reproduit EXACTEMENT le même design visuel
        2. Transforme le JavaScript existant en utilisant les Hooks React appropriés:
           - Remplace les manipulations directes du DOM par useState/useRef
           - Convertis les event listeners en gestionnaires d'événements React
           - Utilise useEffect pour les effets de cycle de vie
        3. Applique les meilleures pratiques React pour l'état et les effets secondaires
        4. Organise le code en composants fonctionnels réutilisables
        5. Utilise styled-components pour tous les styles
        
        Analyse particulièrement:
        - Les éléments interactifs: {structure_analysis.get('interactive_elements', 'à déterminer')}
        - L'approche de style actuelle: {structure_analysis.get('styling_approach', 'à déterminer')}
        
        Le code doit être parfaitement fonctionnel avec tous les imports nécessaires.
        """
    else:
        # Cas HTML/CSS standard
        prompt = f"""
        Voici du code HTML/CSS:
        
        {input_text}
        
        Convertis ce code en un composant React moderne qui:
        1. Reproduit EXACTEMENT le même design visuel
        2. Ajoute de l'interactivité avec JavaScript en utilisant les Hooks React:
           - Identifie les éléments qui pourraient bénéficier d'interactivité (boutons, listes, formulaires)
           - Implémente des états et des gestionnaires d'événements appropriés
           - Ajoute des transitions et animations si pertinent
        3. Structure le code en composants fonctionnels réutilisables
        4. Utilise styled-components pour tous les styles
        5. Rend l'interface responsive et accessible
        
        Analyse particulièrement:
        - Les composants potentiels: {structure_analysis.get('components', 'à déterminer')}
        - Les éléments interactifs potentiels: {structure_analysis.get('interactive_elements', 'à déterminer')}
        
        Le code doit être complet avec tous les imports et une structure de composants claire.
        """
    
    return get_mistral_response(prompt)