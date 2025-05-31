from http.server import BaseHTTPRequestHandler
import json
import os
import requests

def chat_with_ai(message, chat_history):
    try:
        messages = []
        for msg in chat_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        messages.append({
            "role": "user",
            "content": message
        })

        headers = {
            "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",  # or your preferred model
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(
            os.environ.get('OPENROUTER_API_URL'),
            headers=headers,
            json=payload
        )
        response_data = response.json()

        return {
            "reply": response_data['choices'][0]['message']['content'],
            "recommendations": []  # Add your recommendation logic here
        }
    except Exception as e:
        print(f"Error in chat_with_ai: {str(e)}")
        return {"error": str(e)}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            message = data.get('message', '')
            chat_history = data.get('chatHistory', [])

            result = chat_with_ai(message, chat_history)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8')) 