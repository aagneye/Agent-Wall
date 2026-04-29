from dataclasses import dataclass

from app.config.settings import settings


@dataclass(slots=True)
class SafePreparationResult:
    owner_address: str
    safe_address: str | None
    status: str


class SafeService:
    """Safe integration boundary for future account deployment and execution flows."""

    def __init__(self) -> None:
        self.safe_tx_service_url = settings.SAFE_TX_SERVICE_URL
        self.safe_factory_address = settings.SAFE_FACTORY_ADDRESS

    def prepare_account(self, owner_address: str) -> SafePreparationResult:
        return SafePreparationResult(
            owner_address=owner_address,
            safe_address=None,
            status="unprepared",
        )
