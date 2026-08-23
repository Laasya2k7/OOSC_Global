import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai


# Find backend/.env regardless of where Uvicorn is started
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        f"GEMINI_API_KEY not found. Expected .env at: {ENV_FILE}"
    )

client = genai.Client(api_key=api_key)


def ask_copilot(question: str, context: dict) -> str:
    
    prompt = f"""
            You are GeoShield Copilot, an AI assistant for geopolitical
            and supply-chain risk intelligence.

            Your job is to help users quickly understand what is happening
            and what it means.

            Use ONLY the GeoShield data provided below.
            Do not invent events, countries, routes, risk scores,
            statistics, or recommendations.

            If the provided data is insufficient to answer the question,
            say so clearly.

            RESPONSE STYLE:

            - Use simple, user-friendly language.
            - Start with a short 1-2 sentence summary answering the question.
            - Use short sections and bullet points where useful.
            - Highlight important numbers such as risk scores, active events,
            capacity, cost, and transit time.
            - Explain what the numbers mean instead of simply listing them.
            - Avoid unnecessary technical jargon.
            - Do NOT expose internal event IDs such as LIVE-123456 unless
            the user specifically asks for them.
            - Do not overwhelm the user with every piece of available data.
            Include only information relevant to their question.
            - If appropriate, end with a short "What this means" section.
            - Only provide recommendations when they are supported by the
            available GeoShield data.

            A useful response structure is:

            SUMMARY
            Briefly explain the current situation.

            KEY DRIVERS
            Explain the main factors causing the risk.

            CURRENT IMPACT
            Mention the most relevant routes, countries, events,
            or numerical indicators.

            WHAT THIS MEANS
            Explain the practical significance for supply-chain risk.

            CURRENT GEOSHIELD DATA:

            {context}

            USER QUESTION:

            {question}
"""

    response = client.models.generate_content(
        model="gemini-3.7-flash",
        contents=prompt
    )

    return response.text