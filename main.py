# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

# Configure Google API
API_KEY = ""
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-lite')

class PoemRequest(BaseModel):
    direction: str
    recipient: str
    theme: str
    lines: int
    rhyme: str
    style: str

@app.post("/generate-poem")
async def generate_poem(request: PoemRequest):
    try:
        # Create prompt
        prompt = f"""
            Write a {request.lines}-line poem in {request.style} style with {request.rhyme} rhyme scheme.
            Theme: "{request.theme}". For {request.recipient} from the {request.direction}.
            Use vivid imagery and emotional depth. Make it personal and heartfelt.
        """
        
        # Generate poem
        response = model.generate_content(prompt)
        poem = response.text.strip()
        
        return {"poem": poem}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Poem generation failed: {str(e)}")
