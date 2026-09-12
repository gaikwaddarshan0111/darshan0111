from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from datetime import datetime
import os
import resend


app = FastAPI(title="A Little Sorry ❤️")


# ==========================================
# STATIC FILES
# ==========================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


templates = Jinja2Templates(
    directory="templates"
)


# ==========================================
# EMAIL CONFIGURATION
# ==========================================

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

OWNER_EMAIL = os.getenv("OWNER_EMAIL")

FROM_EMAIL = os.getenv(
    "FROM_EMAIL",
    "onboarding@resend.dev"
)


if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


# ==========================================
# REQUEST MODEL
# ==========================================

class ApologyResponse(BaseModel):

    card_type: str

    card_title: str

    response: str


# ==========================================
# HOME
# ==========================================

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


# ==========================================
# APOLOGY RESPONSE
# ==========================================

@app.post("/api/apology-response")
async def apology_response(data: ApologyResponse):

    response_text = data.response.upper()

    if response_text == "YES":

        subject = "❤️ Apology Accepted"

        emoji = "❤️"

        message = "She accepted your apology."


    else:

        subject = "🥺 Apology Not Accepted Yet"

        emoji = "🥺"

        message = "She selected 'Not yet'."


    current_time = datetime.now().strftime(
        "%d %b %Y, %I:%M %p"
    )


    # ======================================
    # SEND EMAIL
    # ======================================

    if RESEND_API_KEY and OWNER_EMAIL:

        try:

            resend.Emails.send({

                "from": FROM_EMAIL,

                "to": [OWNER_EMAIL],

                "subject": subject,

                "html": f"""
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    background: #fff5f7;
                    border-radius: 20px;
                ">

                    <h1 style="
                        color: #3b2930;
                        text-align: center;
                    ">
                        {emoji} Apology Response
                    </h1>


                    <div style="
                        background: white;
                        padding: 25px;
                        border-radius: 16px;
                        margin-top: 20px;
                    ">

                        <h2>
                            {message}
                        </h2>


                        <p>
                            <strong>Card:</strong>
                            {data.card_title}
                        </p>


                        <p>
                            <strong>Response:</strong>
                            {response_text}
                        </p>


                        <p>
                            <strong>Time:</strong>
                            {current_time}
                        </p>

                    </div>


                    <p style="
                        text-align: center;
                        color: #9a7c85;
                        margin-top: 25px;
                    ">
                        © With Love, Darshan 🙂
                    </p>

                </div>
                """

            })

        except Exception as e:

            print(
                "Email sending failed:",
                str(e)
            )


    return {
        "success": True,
        "response": response_text
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
async def health():

    return {
        "status": "ok"
    }


# ==========================================
# LOCAL DEVELOPMENT
# ==========================================

if __name__ == "__main__":

    import uvicorn

    port = int(
        os.environ.get(
            "PORT",
            8000
        )
    )

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )