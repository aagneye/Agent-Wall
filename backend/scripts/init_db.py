"""
Initialize database by creating all tables.
Run this script to create tables directly without Alembic.
For production, prefer using Alembic migrations.
"""
from app.db.base import Base
from app.db.session import engine
from app.models import AgentRun, SecurityEvaluation, ProposedAction, AuditLog


def init_db() -> None:
    """Create all tables in the database."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully!")
    
    # Print created tables
    print("\nCreated tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")


if __name__ == "__main__":
    init_db()
