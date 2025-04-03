from pymongo import MongoClient
from passlib.context import CryptContext
import os

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["virtual_assistant"]
users_collection = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(username: str):
    return users_collection.find_one({"username": username})

def create_user(username: str, password: str):
    if users_collection.find_one({"username": username}):
        return None  
    hashed_password = pwd_context.hash(password)
    users_collection.insert_one({"username": username, "password": hashed_password})
    return True

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)