from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chat_qa import get_bot_response  # your function from chat_qa.py

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(message: Message):
    answer = get_bot_response(message.question)
    return {"response": answer}