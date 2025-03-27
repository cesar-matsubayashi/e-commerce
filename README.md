# E-commerce Project with Clean Architecture and DDD

## Description

This project is an **E-commerce application** developed to study **Clean Architecture** principles combined with **Domain-Driven Design (DDD)** concepts. The application was built using **TypeScript**, **Express**, **Nodemon**, **Sequelize**, **ts-node**, and **Jest** for testing. The structure follows a clear separation of concerns, ensuring scalability, maintainability, and testability.

## Technologies Used

- **TypeScript** - For type safety and improved developer experience
- **Express** - Lightweight framework for handling HTTP requests
- **Nodemon** - Automatic restart during development
- **Sequelize** - ORM for database management
- **ts-node** - For running TypeScript directly
- **Jest** - Testing framework for unit and integration tests

## Project Structure

```
clean-architecture/
├── src
│   ├── domain               # Core domain logic following DDD principles
│   │   ├── @shared          # Shared entities, events, notifications, repositories, and validators
│   │   ├── checkout         # Order-related logic (entities, factories, repositories, services and validators)
│   │   ├── customer         # Customer domain logic (entities, events, factories, repositories, validators and objects)
│   │   └── product          # Product domain logic (entities, events, factories, repositories, services and validators)
│   ├── infrastructure       # External implementations like API routes and Sequelize repositories
│   │   ├── api              # Express routes, presenters, and server setup
│   │   ├── customer         # Customer repository implementation with Sequelize
│   │   ├── order            # Order repository implementation with Sequelize
│   │   └── product          # Product repository implementation with Sequelize
│   └── usecase              # Application use cases for customer and product management
│       ├── customer         # Create, Find, List, and Update customer use cases
│       ├── order            # Create, Find, List, and Update order use cases
|       └── product          # Create, Find, List, and Update product use cases
├── jest.config.ts           # Jest configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tslint.json              # Linting configuration
└── README.md                # Project documentation
```

## Features

- **Domain Layer:** Implements core business logic using entities, value objects, and domain services
- **Infrastructure Layer:** Includes API routes, database interactions (using Sequelize), and server configuration
- **Use Cases:** Dedicated logic for specific application functionalities, improving testability and maintainability
- **Testing:** Comprehensive unit and integration tests using Jest

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone git@github.com:cesar-matsubayashi/e-commerce.git
   cd e-commerce
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Run tests:**
   ```bash
   npm run test
   ```

## Endpoints

- **Customer**

  - `POST /customers` - Create a new customer
  - `GET /customers/:id` - Get a customer by ID
  - `GET /customers` - List all customers
  - `PUT /customers/:id` - Update customer information

- **Product**

  - `POST /products` - Create a new product
  - `GET /products/:id` - Get a product by ID
  - `GET /products` - List all products
  - `PUT /products/:id` - Update product information

- **Order**

  - `POST /orders` - Create a new order
  - `GET /orders/:id` - Get a order by ID
  - `GET /orders` - List all orders
  - `PUT /orders/:id` - Update order information

## Learning Outcomes

This project reinforces key Clean Architecture and DDD concepts such as:

✅ Separation of concerns between domain, infrastructure, and application logic  
✅ Dependency inversion for better flexibility and scalability  
✅ Ensuring business logic is independent of framework or database  
✅ Extensive test coverage for improved reliability

## Author

Cesar Matsubayashi
