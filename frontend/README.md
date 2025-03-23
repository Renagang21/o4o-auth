# O4O-Auth

O4O-Auth is a social login and user role management system for the O4O healthcare platform. It provides authentication and authorization services for various healthcare-related services, including pharmacy automation, e-commerce, and WebPOS.

## Features

- Social login integration (Google, Naver, Kakao)
- Role-based access control (USER, PHARMACIST)
- Multi-level admin roles (SYSTEM, SERVICE, STORE)
- Pharmacist verification system
- Service access control and membership management
- Access control audit logging

## Prerequisites

- Node.js >= 14.0.0
- PostgreSQL >= 12.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/o4o-auth.git
cd o4o-auth
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Database credentials
- JWT secret
- Social login API keys
- Other environment-specific settings

5. Create the database:
```bash
createdb o4o_auth
```

6. Run database migrations:
```bash
psql -d o4o_auth -f db/migrations/001_create_auth_tables.sql
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/naver` - Naver OAuth login
- `POST /api/auth/kakao` - Kakao OAuth login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### User Management Endpoints

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/roles` - Assign role to user
- `DELETE /api/users/:id/roles/:roleId` - Remove role from user

### Pharmacist Management Endpoints

- `POST /api/users/:id/pharmacist` - Register as pharmacist
- `PUT /api/users/:id/pharmacist/verify` - Verify pharmacist
- `GET /api/pharmacists/pending` - Get pending verifications

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/roles` - Manage user roles
- `PUT /api/admin/pharmacists/:id/verify` - Verify pharmacist
- `GET /api/admin/services` - List all services
- `POST /api/admin/services` - Create new service
- `PUT /api/admin/services/:id` - Update service

### Service Management Endpoints

- `GET /api/services` - List available services
- `POST /api/services/:id/request` - Request service access
- `PUT /api/services/:id/access` - Update service access
- `GET /api/services/:id/logs` - Get access control logs

## Testing

Run tests:
```bash
npm test
```

## Security Considerations

- All sensitive data is encrypted
- JWT tokens are used for authentication
- Role-based access control is enforced
- Access control changes are logged
- Input validation and sanitization
- Rate limiting on sensitive endpoints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 