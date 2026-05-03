# TODO: Replace with real 0G Storage SDK write call. SDK: https://docs.0g.ai/build-with-0g/storage-sdk

"""Stub client for logging audit events to 0G decentralized storage."""

from __future__ import annotations

import hashlib
import json
from typing import Any

from app.config.settings import settings


async def log_audit_event(run_id: str, event: dict[str, Any]) -> str:
    """Return a deterministic pseudo storage URI (stub until SDK write exists)."""
    _ = (settings.ZEROG_RPC_URL, settings.ZEROG_PRIVATE_KEY)

    canonical = json.dumps(event, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    digest = hashlib.sha256((run_id + canonical).encode("utf-8")).hexdigest()
    return f"0g://{digest}"
