"""OpenAI-backed plain-English explanations for planner and security payloads."""

from __future__ import annotations

import json

from openai import APIError, APITimeoutError, AsyncOpenAI, RateLimitError

from app.config.settings import settings

FALLBACK_EXPLANATION = "Unable to generate explanation. Review the risk details manually."

SYSTEM_PROMPT = (
    "You are a Web3 security assistant. Given a transaction plan and its security "
    "analysis, explain in 2-3 plain English sentences what this agent is about "
    "to do, what the main risk is, and whether the user should approve it. Be "
    "direct. No jargon."
)

OPENAI_CHAT_MODEL = "gpt-4o-mini"


async def explain_transaction(plan: dict, security: dict) -> str:
    """Return a concise explanation from GPT-4o-mini, or a fixed fallback string on failure."""
    api_key = (settings.OPENAI_API_KEY or "").strip()
    if not api_key:
        return FALLBACK_EXPLANATION

    user_message = json.dumps({"plan": plan, "security": security})

    try:
        client = AsyncOpenAI(api_key=api_key)
        completion = await client.chat.completions.create(
            model=OPENAI_CHAT_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        )

        if not completion.choices:
            return FALLBACK_EXPLANATION
        raw = completion.choices[0].message.content
        text = raw.strip() if raw else ""

        return text if text else FALLBACK_EXPLANATION

    except (APIError, RateLimitError, APITimeoutError):
        return FALLBACK_EXPLANATION
    except Exception:
        return FALLBACK_EXPLANATION
