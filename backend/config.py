import os
from dotenv import load_dotenv

load_dotenv()

STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
FX_API_KEY = os.getenv("FX_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/olamexico")
