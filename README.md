# Nuxt Starter Kit

A production-ready starter template for Nuxt 3 applications with built-in features and integrations.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - User invitation system
  - [Learn more about auth](./docs/authentication.md)

- 🎨 **UI & Components**
  - [Nuxt UI](https://ui.nuxt.com/) integration
  - Dark mode support
  - Responsive layouts
  - Form validation with Zod
  - Interactive data tables
  - Toast notifications

- 🛠 **Development Tools**
  - TypeScript support
  - ESLint & Prettier configuration
  - Git hooks with Husky
  - Prisma for database management
  - [Database integration details](./docs/database.md)

- 📧 **Communication**
  - Email service integration
  - Customizable templates
  - Queue system for notifications
  - [Email integration guide](./docs/mail.md)

- 💳 **Payments**
  - Stripe integration
  - Subscription management
  - Payment history
  - [Payment system setup](./docs/payments.md)

- 🔒 **Security**
  - Rate limiting
  - Input sanitization
  - CORS configuration
  - Environment variables management
  - [Security best practices](./docs/security.md)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/nuxt-starter-kit.git

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Setup

1. Configure your database connection in `.env`
2. Set up your mail server credentials
3. Add your JWT secrets
4. Configure other optional services

## Project Structure

```
nuxt-starter-kit/
│
├── app/                    # Nuxt application
│   ├── components/        # Vue components
│   ├── composables/       # Vue composables
│   ├── layouts/          # Page layouts
│   └── pages/            # Application pages
│
├── prisma/                # Database schema and migrations
├── server/                # Server-side code
│   ├── api/              # API routes
│   ├── middleware/       # Server middleware
│   └── utils/           # Server utilities
│
└── shared/               # Shared code
    └── schemas/         # Validation schemas
```

## Core Technologies

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Nuxt UI](https://ui.nuxt.com/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Documentation

Detailed documentation for specific features:

- [Authentication & Authorization](./docs/authentication.md)
- [Database Integration](./docs/database.md)
- [Email System](./docs/mail.md)
- [Payment Integration](./docs/payments.md)
- [Security](./docs/security.md)
- [API Documentation](./docs/api.md)
- [Permissions](./docs/permissions.md)

## License

MIT License - see [LICENSE](LICENSE) for details
