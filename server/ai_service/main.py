from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict
import requests
import os
from dotenv import load_dotenv
import pandas as pd
from PIL import Image
import io
import numpy as np
from scipy import ndimage
import json

load_dotenv()

app = FastAPI()

# Load OpenRouter API key from environment
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Load products from CSV
try:
    products_df = pd.read_csv('products.csv')
    print(f"Loaded {len(products_df)} products from CSV")
    print("Available columns:", list(products_df.columns))
    print("\nFirst product data:")
    print(products_df.iloc[0].to_dict())
except FileNotFoundError:
    print("Warning: products.csv not found")
    products_df = pd.DataFrame()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    chatHistory: Optional[List[ChatMessage]] = []

def analyze_skin_features(image):
    """Extract features for skin analysis using image processing"""
    try:
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Resize image to standardize analysis
        image = image.resize((300, 300))
            
        # Convert image to numpy array
        img_array = np.array(image)
        
        # Split into RGB channels
        r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
        
        # Convert to HSV for better skin analysis
        hsv_img = Image.fromarray(img_array).convert('HSV')
        hsv_array = np.array(hsv_img)
        
        # Extract color channels
        hue = hsv_array[:,:,0]
        saturation = hsv_array[:,:,1]
        value = hsv_array[:,:,2]
        
        # Calculate basic metrics
        avg_saturation = np.mean(saturation)
        avg_brightness = np.mean(value)
        texture_variance = np.std(value)
        
        # Enhanced spot detection
        # Red intensity relative to other colors for acne detection
        redness = r - (g + b) / 2
        # Detect potential spots using multiple criteria
        spot_mask = (
            (redness > 30) &  # High redness
            (saturation > 50) &  # Moderate to high saturation
            (value < 200)  # Not too bright (to avoid highlights)
        )
        
        # Calculate spot metrics
        spot_count = np.sum(spot_mask)
        total_pixels = img_array.shape[0] * img_array.shape[1]
        spot_ratio = spot_count / total_pixels
        
        # Enhanced texture analysis
        local_variance = ndimage.generic_filter(value, np.var, size=5)
        texture_score = np.mean(local_variance)
        
        # Determine severity based on multiple factors
        severity_score = (
            (spot_ratio * 5) +  # Weight spot ratio
            (np.mean(redness) / 255) +  # Consider overall redness
            (texture_score / 1000)  # Consider texture
        )
        
        if severity_score < 0.1:
            severity = "None"
            confidence = 0.9
        elif severity_score < 0.2:
            severity = "Mild"
            confidence = 0.8
        elif severity_score < 0.3:
            severity = "Moderate"
            confidence = 0.85
        else:
            severity = "Severe"
            confidence = 0.9
            
        # Calculate additional metrics
        uniformity = 1.0 - (np.std(value) / 128)  # Higher is more uniform
        brightness_variation = np.std(value) / np.mean(value)  # Variation in brightness
        
        return {
            "severity": severity,
            "confidence": confidence,
            "metrics": {
                "saturation": float(avg_saturation),
                "brightness": float(avg_brightness),
                "texture": float(texture_score),
                "spot_ratio": float(spot_ratio),
                "redness": float(np.mean(redness)),
                "uniformity": float(uniformity),
                "brightness_variation": float(brightness_variation)
            }
        }
        
    except Exception as e:
        print(f"Error in feature extraction: {str(e)}")
        return None

def analyze_skin_condition(image_bytes):
    """Analyze skin condition using image processing"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Get features
        features = analyze_skin_features(image)
        
        if not features:
            raise Exception("Failed to extract image features")
        
        # Determine skin characteristics based on analysis
        metrics = features['metrics']
        
        # List to store specific concerns
        concerns = []
        
        # Add concerns based on enhanced metrics
        if features['severity'] != "None":
            concerns.append(f"{features['severity']} acne detected")
        
        if metrics['texture'] > 1000:
            concerns.append("Significant texture irregularities")
        elif metrics['texture'] > 500:
            concerns.append("Moderate texture concerns")
        
        if metrics['brightness'] < 100:
            concerns.append("Signs of dehydration")
        elif metrics['brightness'] < 130:
            concerns.append("Slightly dry skin")
        
        if metrics['saturation'] > 120:
            concerns.append("Excessive oil production")
        elif metrics['saturation'] > 80:
            concerns.append("Slightly oily skin")
            
        if metrics['redness'] > 20:
            concerns.append("Increased skin redness")
            
        if metrics['uniformity'] < 0.6:
            concerns.append("Uneven skin tone")
            
        if not concerns:
            concerns.append("No significant skin concerns detected")
        
        return {
            "acne": {
                "severity": features['severity'],
                "confidence": f"{features['confidence']*100:.1f}%",
                "location": "Face"
            },
            "hydration": "Low" if metrics['brightness'] < 100 else "Moderate" if metrics['brightness'] < 130 else "Good",
            "oiliness": "High" if metrics['saturation'] > 120 else "Moderate" if metrics['saturation'] > 80 else "Low",
            "sensitivity": "High" if metrics['redness'] > 20 else "Moderate" if metrics['redness'] > 10 else "Low",
            "concerns": concerns,
            "metrics": {
                "spot_density": f"{metrics['spot_ratio']*100:.1f}%",
                "texture_score": f"{min(100, metrics['texture']/10):.1f}/100",
                "hydration_score": f"{min(100, metrics['brightness']/2):.1f}/100",
                "oil_score": f"{min(100, metrics['saturation']/2):.1f}/100",
                "evenness_score": f"{metrics['uniformity']*100:.1f}/100",
                "redness_score": f"{min(100, metrics['redness']*2):.1f}/100"
            }
        }
        
    except Exception as e:
        print(f"Error in skin analysis: {str(e)}")
        return {
            "acne": {"severity": "Unknown", "location": "Face"},
            "hydration": "Unknown",
            "oiliness": "Unknown",
            "sensitivity": "Unknown",
            "concerns": ["Unable to analyze image"],
            "metrics": {
                "spot_density": "N/A",
                "texture_score": "N/A",
                "hydration_score": "N/A",
                "oil_score": "N/A",
                "evenness_score": "N/A",
                "redness_score": "N/A"
            }
        }

@app.post("/analyze-skin")
async def analyze_skin(file: UploadFile = File(...)):
    try:
        # Read the image file
        contents = await file.read()
        
        # Analyze the image
        analysis = analyze_skin_condition(contents)
        
        return {
            "analysis": analysis,
            "raw_response": "Analysis completed successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_product_recommendations(user_message: str, chat_history: List[ChatMessage]) -> List[Dict]:
    """Get product recommendations based on user message and chat history"""
    try:
        # Create a prompt for the LLM to understand user's needs
        prompt = f"""Based on the following chat history and user message, identify the type of skincare product and skin concerns:
Chat History:
{' '.join([f"{msg.role}: {msg.content}" for msg in chat_history])}

User Message: {user_message}

Identify:
1. Product type (e.g., face wash, moisturizer, serum)
2. Skin concerns (e.g., acne, dry, oily)
3. Any specific requirements

Respond in a structured format."""

        # Get LLM's analysis using OpenRouter
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json={
                "model": "anthropic/claude-3-opus-20240229",
                "messages": [
                    {"role": "system", "content": "You are a skincare expert helping to identify product needs."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 150
            }
        )
        
        response_data = response.json()
        print("OpenRouter API Response:", json.dumps(response_data, indent=2))
        
        if 'error' in response_data:
            print("OpenRouter API Error:", response_data['error'])
            if 'code' in response_data['error'] and response_data['error']['code'] == 402:
                # If it's a credits error, try with a smaller model
                response = requests.post(
                    OPENROUTER_URL,
                    headers=headers,
                    json={
                        "model": "mistralai/mistral-7b-instruct",
                        "messages": [
                            {"role": "system", "content": "You are a skincare expert helping to identify product needs."},
                            {"role": "user", "content": prompt}
                        ],
                        "max_tokens": 150
                    }
                )
                response_data = response.json()
                print("Fallback API Response:", json.dumps(response_data, indent=2))
            else:
                return []
            
        analysis = response_data['choices'][0]['message']['content']
        print("LLM Analysis:", analysis)

        # Filter products based on LLM's analysis
        relevant_products = []
        
        # Convert analysis to lowercase for better matching
        analysis_lower = analysis.lower()
        
        for _, product in products_df.iterrows():
            should_recommend = False
            
            # Match product type
            if product['type'].lower() in analysis_lower:
                should_recommend = True
                
            # Match skin type
            if product['skin_type'].lower() in analysis_lower:
                should_recommend = True
                
            if should_recommend:
                description = f"A {product['type']} specifically designed for {product['skin_type']} skin"
                product_data = {
                    'name': product['name'],
                    'description': description,
                    'price': float(product['price']),
                    'category': product['type'],
                    'image_url': product['image_url']
                }
                print(f"Adding product with image URL: {product_data['image_url']}")
                relevant_products.append(product_data)
        
        return relevant_products[:3]  # Return top 3 most relevant products
        
    except Exception as e:
        print(f"Error in product recommendations: {str(e)}")
        return []

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Check if this is a greeting or conversation starter
        greeting_words = ["hi", "hello", "hey", "start", "help"]
        is_greeting = request.message.lower().strip() in greeting_words
        
        # Format chat history for context
        if is_greeting:
            messages = [
                {"role": "system", "content": "You are a helpful beauty advisor. When a user starts the conversation, ask about their skincare needs and preferences. Do not recommend products yet."},
                {"role": "user", "content": request.message}
            ]
        else:
            messages = [
                {"role": "system", "content": "You are a helpful beauty advisor. Provide personalized skincare advice and product recommendations."}
            ]
            
            # Add chat history
            if request.chatHistory:
                for msg in request.chatHistory:
                    messages.append({"role": msg.role, "content": msg.content})
            
            # Add user's current message
            messages.append({"role": "user", "content": request.message})
        
        # Get chatbot response from OpenRouter
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json={
                "model": "anthropic/claude-3-opus-20240229",
                "messages": messages,
                "max_tokens": 150
            }
        )
        
        response_data = response.json()
        print("OpenRouter Chat Response:", json.dumps(response_data, indent=2))
        
        if 'error' in response_data:
            print("OpenRouter API Error:", response_data['error'])
            if 'code' in response_data['error'] and response_data['error']['code'] == 402:
                # If it's a credits error, try with a smaller model
                response = requests.post(
                    OPENROUTER_URL,
                    headers=headers,
                    json={
                        "model": "mistralai/mistral-7b-instruct",
                        "messages": messages,
                        "max_tokens": 150
                    }
                )
                response_data = response.json()
                print("Fallback API Response:", json.dumps(response_data, indent=2))
            else:
                raise HTTPException(status_code=500, detail=str(response_data['error']))
            
        chat_reply = response_data['choices'][0]['message']['content']
        
        # Only get product recommendations if this is not a greeting
        recommendations = [] if is_greeting else get_product_recommendations(request.message, request.chatHistory)
        
        print("Final recommendations:", recommendations)
        
        return {
            "reply": chat_reply,
            "recommendations": recommendations
        }

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 