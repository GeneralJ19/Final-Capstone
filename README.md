# ProphetPlay - AI-Powered Sports Betting Platform

ProphetPlay is an advanced sports betting prediction platform that combines the power of artificial intelligence with the wisdom of Zeus to provide accurate sports predictions.

## Features

- AI-powered sports predictions
- Real-time odds analysis
- Historical performance tracking
- User-friendly interface with Zeus theme
- Multiple sports coverage
- Advanced statistics and analytics

## Tech Stack

- Backend: Python (FastAPI)
- Frontend: React with TypeScript
- Database: PostgreSQL
- Machine Learning: TensorFlow/PyTorch
- Authentication: JWT

## Setup Instructions

### Prerequisites

- Python 3.11.9 (recommended)
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup

1. Create a virtual environment:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

2. Install dependencies:
```bash
# From the root directory
pip install -r requirements.txt
# OR from the backend directory
pip install -r backend/requirements.txt
```

3. Set up environment variables:
Make sure the .env file in the backend directory contains your configurations.
Generate a new JWT secret if needed:
```bash
python backend/generate_jwt_secret.py
```

4. Initialize the database:
```bash
# First ensure PostgreSQL is running and create the database
# Then run:
cd backend
python -m app.init_db
```

5. Run the backend:
```bash
cd backend
python run.py
# OR
uvicorn app.main:app --reload
```

The backend API will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Project Structure

```
prophetplay/
├── backend/
│   ├── app/
│   │   ├── core/         # Configuration and settings
│   │   ├── models/       # Database models
│   │   ├── routers/      # API route handlers
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── main.py       # FastAPI application
│   │   └── database.py   # Database connection
│   ├── tests/
│   ├── .env              # Environment variables
│   ├── run.py            # Application runner
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application
│   ├── public/
│   └── package.json      # NPM dependencies
├── requirements.txt      # Root-level Python dependencies
└── README.md
```

## Default Admin Credentials

After initializing the database, you can log in with:
- Username: admin
- Password: admin1234

*Note: Change these credentials immediately in a production environment*

## License

MIT License 