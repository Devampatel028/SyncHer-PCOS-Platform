import requests
import os

url = 'http://localhost:8000/analyze-skin'
image_path = r'c:\Users\devam\OneDrive\Desktop\saheli\Saheli-Smart PCOS Care\backend\uploads\skin-1772844710236-195479504.jpg'

if not os.path.exists(image_path):
    print(f"Error: Image not found at {image_path}")
    exit(1)

files = {'image': open(image_path, 'rb')}
try:
    response = requests.post(url, files=files)
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
