from fastapi import FastAPI ,  HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv 
import os 
from database import create_user
from models import User, ChatRequest, Token
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register")
async def register(user: User):
    if not create_user(user.username, user.password):
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "User registered successfully"}


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

#models = genai.list_models()
#for model in models:
#    print(model.name)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        model = genai.GenerativeModel("gemini-1.5-pro-latest")  
        response = model.generate_content(request.message)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)