# E-commerce

This is a scalable E-commerce project built using **TypeScript** and **Sequelize** with a clean architecture approach. It follows domain-driven design principles and includes robust testing using **Jest**.

## Usage

### Running the Project

To start the application:

```bash
npm start
```

### Running Tests

To execute unit tests with Jest:

```bash
npm test
```

## Features

### Domain Entities

- **Customer**

  - `Customer` entity with properties like `id`, `name`, and `address`.
  - `CustomerFactory` for consistent creation logic.
  - `CustomerRepositoryInterface` for defining repository contract.

- **Product**

  - `Product` entity with properties like `id`, `name`, and `price`.
  - `ProductFactory` for object creation.
  - `ProductRepositoryInterface` for repository contract.

- **OrderItem**

  - `OrderItem` entity representing items in customer orders.
  - `OrderFactory` for object creation.
  - `OrderRepositoryInterface` for repository contract.

### Use Cases

- **Customer Use Cases:**

  - Create
  - Find
  - List
  - Update

- **Product Use Cases:**
  - Create
  - Find
  - List
  - Update

### Infrastructure

- Sequelize repositories implementing the repository interfaces for:
  - Customer
  - Product
  - OrderItem

## Technologies

- **TypeScript** for improved code quality and maintainability.
- **Sequelize** as the ORM for database interaction.
- **Jest** for unit testing.
