import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
from google import genai
from dotenv import load_dotenv
import os
import asyncio
import httpx

load_dotenv()

# Create your views here.

client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

@api_view(['POST'])
async def generate(request):
    title = request.data.get('title')
    if not title:
        return JsonResponse({'error':'Title is Required'}, status=400)
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
            json={"prompt": f"Write an article on the topic: {title} in 400 words"},
            headers={"Authorization": f"Bearer {os.getenv('GOOGLE_API_KEY')}"}
        )

    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to generate content'}, status=500)

    return JsonResponse({'content': response.json().get('text', 'No content generated')})

@api_view(['POST'])
async def optimize(request):
    content = request.data.get('content')

    if not content:
        return JsonResponse({'error':'Content is Required'})
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent",
            json={"prompt": f"Optimize this article: {content}"},
            headers={"Authorization": f"Bearer {os.getenv('GOOGLE_API_KEY')}"}
        )

    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to optimize content'}, status=500)

    return JsonResponse({'content': response.json().get('text', 'No content generated')})

