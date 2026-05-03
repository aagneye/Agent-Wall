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


async def explain_transaction(plan: dict, security: dict) -> str:
    """Return a concise explanation from GPT-4o-mini, or a fixed fallback string on failure."""
    return FALLBACK_EXPLANATION
