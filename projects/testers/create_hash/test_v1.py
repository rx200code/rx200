# python3 test.py
from urllib.parse import urlencode
import hmac
import hashlib
import base64

sign_param = "tVg78Xv6uscTGYDz9THlpvCuYiM_mhGQmRXOTHhdR0U"
client_secret = b"sPntLaiCyKYd8QFhQ69w"
hash_params = {
	"app_id": "52910233",
	"request_id": "test text",
	"ts": "1759645290",
	"user_id": "1477085"
}

sign_params_query = urlencode(hash_params)

h = hmac.new(client_secret, sign_params_query.encode('utf-8'), hashlib.sha256)


encoded_string = base64.b64encode(h.digest()).decode('utf-8').replace("+", "-").replace("/", "_").rstrip("=")

#print(f"Original string: {original_string}")
print(f"Encoded string (Base64): {encoded_string}")

# python3 test.py
"""
from urllib.parse import urlencode
import hmac
import hashlib
import base64

sign_param = "tVg78Xv6uscTGYDz9THlpvCuYiM_mhGQmRXOTHhdR0U"
client_secret = b"sPntLaiCyKYd8QFhQ69w"
hash_params = {
	"app_id": "52910233",
	"request_id": "test text",
	"ts": "1759645290",
	"user_id": "1477085"
}
print(sign_param == base64.b64encode(hmac.new(client_secret, urlencode(hash_params).encode('utf-8'), hashlib.sha256).digest()).decode('utf-8').replace("+", "-").replace("/", "_").rstrip("="))
"""

