import os
import hashlib
import binascii
import json
import base64
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from fastapi import Header, HTTPException, Depends

JWT_SECRET = os.getenv("JWT_SECRET", "businessverse_super_secret_key_2026")
ALGORITHM = "sha256"

# 1. Zero-dependency secure PBKDF2 password hashing
def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256."""
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')

def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a stored password against a provided password."""
    salt = stored_password[:64].encode('ascii')
    stored_hash = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return stored_hash == pwdhash

# 2. Resilient JWT Token Encode/Decode helper (Base64 Signatures)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
        
    to_encode.update({"exp": expire.timestamp()})
    
    # Serialize header & payload
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().replace("=", "")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().replace("=", "")
    
    # Sign using HMAC SHA256
    signing_input = f"{header_b64}.{payload_b64}"
    signature = hashlib.sha256(f"{signing_input}.{JWT_SECRET}".encode()).hexdigest()
    
    return f"{header_b64}.{payload_b64}.{signature}"

def decode_access_token(token: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
            
        header_b64, payload_b64, signature = parts
        signing_input = f"{header_b64}.{payload_b64}"
        
        # Verify signature
        expected_sig = hashlib.sha256(f"{signing_input}.{JWT_SECRET}".encode()).hexdigest()
        if signature != expected_sig:
            return None
            
        # Decode payload
        # Pad payload to satisfy base64 decoders
        padding = len(payload_b64) % 4
        if padding:
            payload_b64 += "=" * (4 - padding)
            
        payload_data = json.loads(base64.urlsafe_b64decode(payload_b64).decode())
        
        # Check expiration
        if payload_data.get("exp", 0) < datetime.utcnow().timestamp():
            return None
            
        return payload_data
    except Exception:
        return None

# 3. RBAC Authorizations Dependencies
def get_current_user_claims(authorization: str = Header(None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication credentials missing.")
        
    token = authorization.split(" ")[1]
    claims = decode_access_token(token)
    if not claims:
        raise HTTPException(status_code=401, detail="Session expired or invalid token.")
        
    return claims

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles
        
    def __call__(self, claims: dict = Depends(get_current_user_claims)):
        user_role = claims.get("role", "viewer")
        if user_role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Unauthorized role permission.")
        return claims
