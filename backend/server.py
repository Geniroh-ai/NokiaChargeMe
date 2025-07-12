from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chat_qa import get_bot_response, chat_history_collection  # your function from chat_qa.py
from langchain_core.documents import Document

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

class Feedback(BaseModel):
    rating: int
    query: str
    response: str

@app.post("/feedback")
async def feedback_endpoint(feedback: Feedback):
    print(f"Received feedback: rating={feedback.rating}, query={feedback.query}, response={feedback.response}")
    # Store feedback into ChromaDB or a separate collection
    chat_history_collection.add_documents([
        Document(
            page_content=f"User gave {feedback.rating}⭐️ for: {feedback.response}",
            metadata={"role": "feedback", "query": feedback.query}
        )
    ])
    print(f"✅ Stored feedback: {feedback.rating} stars")
    return {"status": "success"}