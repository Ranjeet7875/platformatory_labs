# Profile Management System Documentation

## Overview
A full-stack profile management system with Google OAuth, Temporal workflows, and Docker containerization.

## Table of Contents
- Tech Stack
- Project Structure
- Setup Instructions
- API Documentation
- Docker & Temporal

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: Google OAuth2.0
- **Workflow Engine**: Temporal.io
- **Containerization**: Docker

## Project Structure
````plaintext
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── temporal/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
````

## Setup Instructions

### Local Development
1. Clone the repository:
````bash
git clone https://github.com/yourusername/profile-management.git
cd profile-management
````

2. Install dependencies:
````bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
````

3. Configure environment variables:
````plaintext
MONGO_URI=mongodb://localhost:27017/profiles
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
````

### Docker Setup
1. Build and run containers:
````bash
docker-compose up --build
````

2. Access services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Temporal UI: http://localhost:8088

## API Documentation

### Authentication Endpoints
````javascript
GET /auth/google          // Initialize Google OAuth
GET /auth/google/callback // OAuth callback
GET /auth/status          // Check auth status
POST /auth/logout         // Logout user
````

### Profile Endpoints
````javascript
GET    /api/profile      // Get user profile
POST   /api/profile      // Create profile
PUT    /api/profile      // Update profile
DELETE /api/profile      // Delete profile
````

## Docker & Temporal

### Docker Commands
````bash
# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f service_name
````

### Temporal Workflows
Profile update workflow handles:
- Database updates
- External API synchronization
- Retry mechanisms
- Error handling

## Development Guidelines

### Code Style
- Use ESLint for code linting
- Follow Airbnb style guide
- Use TypeScript for type safety

### Testing
````bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
````

## Deployment

### Production Build
````bash
# Build frontend
cd frontend
npm run build

# Build and deploy Docker containers
docker-compose -f docker-compose.prod.yml up --build
````

## Troubleshooting

### Common Issues
1. Connection errors:
   - Check MongoDB connection
   - Verify environment variables
   - Ensure ports are available

2. Authentication issues:
   - Validate Google OAuth credentials
   - Check session configuration
   - Clear browser cookies

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit pull request

## License
This project is licensed under the MIT License.