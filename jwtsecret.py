import secrets
import string

def generate_jwt_secret(length=32):
    # Generate a secure random string using secrets module
    alphabet = string.ascii_letters + string.digits + string.punctuation
    jwt_secret = ''.join(secrets.choice(alphabet) for _ in range(length))
    return jwt_secret

if __name__ == "__main__":
    secret = generate_jwt_secret()
    print("\nGenerated JWT Secret:")
    print(secret)
    print("\nCopy this value and paste it in your .env file as JWT_SECRET")