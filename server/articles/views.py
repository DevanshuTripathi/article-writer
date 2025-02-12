import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

# Create your views here.

client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

@api_view(['POST'])
def generate(request):
    title = request.data.get('title')
    if not title:
        return JsonResponse({'error':'Title is Required'}, status=400)
    
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents = f"Write an article on the topic: {title} "
    )

    return JsonResponse({'content' : response.text})

@api_view(['POST'])
def optimize(request):
    content = request.data.get('content')

    if not content:
        return JsonResponse({'error':'Content is Required'})
    
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents = f"Optimize this article: {content} "
    )

    return JsonResponse({'content' : response.text})

