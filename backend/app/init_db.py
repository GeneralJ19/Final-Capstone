from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .models.user import User
from .services.auth_service import auth_service
from .core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """
    Initialize the database with tables and initial data
    """
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Create a database session
    db = next(get_db())
    
    # Check if admin user exists
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        # Create admin user
        admin_password = "admin1234"  # This is just for development, use a secure password in production
        admin = User(
            email="admin@prophetplay.com",
            username="admin",
            full_name="Admin User",
            hashed_password=auth_service.get_password_hash(admin_password),
            is_active=True,
            is_superuser=True
        )
        db.add(admin)
        db.commit()
        logger.info("Admin user created")
    
    logger.info("Database initialization completed")

if __name__ == "__main__":
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully") 