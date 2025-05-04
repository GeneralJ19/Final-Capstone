from flask import Flask
from flask_cors import CORS
from .routes.espn_proxy import espn_proxy
from .routes.predictions import predictions
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Register blueprints
    app.register_blueprint(espn_proxy, url_prefix='/api')
    app.register_blueprint(predictions, url_prefix='/api/predictions')
    
    @app.route('/health')
    def health_check():
        return {'status': 'ok'}
    
    return app

# Create the application instance
app = create_app() 