import os
import json
import glob
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from bs4 import BeautifulSoup
import pandas as pd

app = FastAPI(title="Igrot Kodesh Search Engine")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Store
LETTERS_DB = []
DF = None

class Letter(BaseModel):
    id: str
    vol: int
    index: int
    text: str
    clean_text: str

def load_data():
    global LETTERS_DB, DF
    # Use absolute path relative to this file
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data")
    json_files = glob.glob(os.path.join(data_path, "IgrotKodesh_*.json"))
    
    all_letters = []
    
    print(f"Found {len(json_files)} JSON files.")
    
    for file_path in json_files:
        try:
            filename = os.path.basename(file_path)
            # Extract volume number from filename (e.g., IgrotKodesh_1.json -> 1)
            vol_str = filename.replace("IgrotKodesh_", "").replace(".json", "")
            if not vol_str.isdigit():
                continue
            vol = int(vol_str)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            for idx, item in enumerate(data):
                if "Igroys_text" in item:
                    raw_text = item["Igroys_text"]
                    # Simple cleanup for search index
                    soup = BeautifulSoup(raw_text, "lxml")
                    clean_text = soup.get_text()
                    
                    letter = {
                        "id": f"{vol}_{idx}",
                        "vol": vol,
                        "index": idx,
                        "text": raw_text,
                        "clean_text": clean_text
                    }
                    all_letters.append(letter)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")

    LETTERS_DB = all_letters
    DF = pd.DataFrame(all_letters)
    print(f"Loaded {len(LETTERS_DB)} letters into memory.")

@app.on_event("startup")
async def startup_event():
    load_data()

# API Router
api_router = APIRouter()

@api_router.get("/search")
async def search(
    q: str = Query(..., min_length=1),
    page: int = 1,
    limit: int = 20,
    exact: bool = False
):
    if DF is None or DF.empty:
        return {"total": 0, "results": []}
    
    if exact:
        # Exact match (whole word or phrase)
        mask = DF['clean_text'].str.contains(q, case=False, regex=False)
    else:
        # Contains
        mask = DF['clean_text'].str.contains(q, case=False, regex=False)
        
    results_df = DF[mask]
    total = len(results_df)
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    
    paginated = results_df.iloc[start:end]
    
    results = []
    for _, row in paginated.iterrows():
        # Create a snippet
        text = row['clean_text']
        try:
            idx = text.lower().find(q.lower())
            if idx != -1:
                start_snip = max(0, idx - 50)
                end_snip = min(len(text), idx + 100)
                snippet = "..." + text[start_snip:end_snip] + "..."
            else:
                snippet = text[:150] + "..."
        except:
            snippet = text[:150] + "..."
            
        results.append({
            "id": row['id'],
            "vol": row['vol'],
            "index": row['index'],
            "snippet": snippet
        })
        
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": results
    }

@api_router.get("/letter/{letter_id}")
async def get_letter(letter_id: str):
    letter = next((item for item in LETTERS_DB if item["id"] == letter_id), None)
    
    if not letter:
        raise HTTPException(status_code=404, detail="Letter not found")
        
    return letter

# Include API router
app.include_router(api_router, prefix="/api")

# Serve Static Files
# We expect the frontend build to be in 'static' directory relative to this file
static_dir = os.path.join(os.path.dirname(__file__), "static")

if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    # Catch-all for SPA
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Check if file exists in static (e.g. favicon.ico)
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise return index.html
        return FileResponse(os.path.join(static_dir, "index.html"))
else:
    print(f"Warning: Static directory {static_dir} not found. Frontend will not be served.")
