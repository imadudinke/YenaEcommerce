import requests

ENDPOINT = "http://localhost:8000/api/token/"

data = {
    "email": "imad@gmail.com",
    "password": "1111"
}

response = requests.post(ENDPOINT, json=data)

print(f"Status Code: {response.status_code}")
print(f"Response JSON: {response.json()}")

if response.status_code == 200:
    tokens = response.json()
    access_token = tokens.get('access')
    refresh_token = tokens.get('refresh')
    print(f" Token: {tokens}")
