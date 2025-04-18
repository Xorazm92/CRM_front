
# LMS (Learning Management System) Admin Panel

This is a Learning Management System admin panel built with React, TypeScript, and Tailwind CSS.

## Features

- User Authentication (Admin, Manager, Teacher, Student roles)
- Student Management
- Teacher Management
- Group Management
- Attendance Tracking
- Payment Management
- Parent Management
- Reports Generation
- Course Management
- Profile Management

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5000

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages/routes
├── services/      # API service functions
├── store/         # State management
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── config/        # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication

The system uses JWT-based authentication. Users must log in with their credentials to access the system. Different roles (Admin, Manager, Teacher, Student) have different access levels and permissions.

## API Integration

The application communicates with a backend API. All API calls are made through the axios instance configured in `src/config/axios-instance.ts`.

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components
3. Implement proper error handling
4. Add appropriate comments for complex logic
5. Test your changes before submitting

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Ant Design
- React Query
- Axios
- Zustand
