from fastapi import FastAPI, UploadFile, status
from fastapi.responses import JSONResponse

app = FastAPI(title="LSC AI Services")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/tag")
async def tag_image(file: UploadFile):
    # Intentionally unimplemented to avoid returning simulated data.
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED, 
        content={"detail": "Tagging service not yet implemented."}
    )

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile):
    return JSONResponse(
        status_code=status.HTTP_501_NOT_IMPLEMENTED, 
        content={"detail": "Transcription service not yet implemented."}
    )
