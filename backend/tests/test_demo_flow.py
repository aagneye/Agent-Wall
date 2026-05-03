"""
Hackathon demo: call the local Agent Firewall API in order.

Run backend:  uvicorn app.main:app --reload --port 8000
Run script:   pip install requests && python tests/test_demo_flow.py
"""

from __future__ import annotations

import json
import sys
from typing import Any

import requests

BASE_URL = "http://localhost:8000"
API_PREFIX = "/api/v1"

PROMPT = "Optimize my USDC yield safely"
USER_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"


def _print_divider() -> None:
    print("\n" + "=" * 72)


def _print_response(title: str, response: requests.Response) -> None:
    _print_divider()
    print(title)
    _print_divider()
    print(f"HTTP {response.status_code}")
    try:
        body: Any = response.json()
        print(json.dumps(body, indent=2, ensure_ascii=False))
    except requests.JSONDecodeError:
        print(response.text if response.text else "(empty body)")


def _require_ok(response: requests.Response, label: str) -> None:
    if not response.ok:
        _print_response(f"FAILED: {label}", response)
        sys.exit(1)


def main() -> None:
    session = requests.Session()
    session.headers["Content-Type"] = "application/json"

    # 1. Health
    r1 = session.post(f"{BASE_URL}{API_PREFIX}/health/", timeout=60)
    _print_response("Step 1 — POST /api/v1/health", r1)
    _require_ok(r1, "health")

    # 2. Console submit
    r2 = session.post(
        f"{BASE_URL}{API_PREFIX}/agent/console/submit",
        json={"prompt": PROMPT, "user_address": USER_ADDRESS},
        timeout=60,
    )
    _print_response("Step 2 — POST /api/v1/agent/console/submit", r2)
    _require_ok(r2, "console submit")
    run_id = r2.json().get("runId")
    if not run_id:
        print("ERROR: missing runId in submit response")
        sys.exit(1)

    # 3. Planner
    r3 = session.post(
        f"{BASE_URL}{API_PREFIX}/agent/planner/plan",
        json={"prompt": PROMPT, "runId": run_id},
        timeout=120,
    )
    _print_response("Step 3 — POST /api/v1/agent/planner/plan", r3)
    _require_ok(r3, "planner")
    plan = r3.json()

    # 4. Security evaluate
    r4 = session.post(
        f"{BASE_URL}{API_PREFIX}/agent/security/evaluate",
        json={"plan": plan, "runId": run_id},
        timeout=120,
    )
    _print_response("Step 4 — POST /api/v1/agent/security/evaluate", r4)
    _require_ok(r4, "security evaluate")
    security = r4.json()

    # 5. Explain
    r5 = session.post(
        f"{BASE_URL}{API_PREFIX}/agent/explain",
        json={"plan": plan, "security": security},
        timeout=120,
    )
    _print_response("Step 5 — POST /api/v1/agent/explain", r5)
    _require_ok(r5, "explain")

    # 6. Execute
    r6 = session.post(
        f"{BASE_URL}{API_PREFIX}/agent/execute",
        json={"run_id": run_id, "plan": plan, "user_address": USER_ADDRESS},
        timeout=120,
    )
    _print_response("Step 6 — POST /api/v1/agent/execute", r6)
    _require_ok(r6, "execute")

    _print_divider()
    print("Demo flow completed successfully.")
    _print_divider()


if __name__ == "__main__":
    main()
