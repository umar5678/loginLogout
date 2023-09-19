# Authentication System with Express, MongoDB, and JWT

This is a simple authentication system built using Express.js, MongoDB, JSON Web Tokens (JWT), and bcrypt for password hashing. It allows users to register, log in, and log out. This README provides an overview of the project structure and usage.

## Features

- User registration with password hashing for security.
- User login with JWT-based authentication.
- User logout with token removal.
- Basic error handling and logging.
- Rate limiting to protect against brute-force attacks.
- Security headers using Helmet middleware.
- Static files served via Express.
- EJS templates for rendering views.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js and npm
- MongoDB

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   https://github.com/umar5678/loginLogout.git

2. Install the project dependencies:

    ```bash
    npm I

3. Configure Environment Variables

4. Start the application:

   ```bash
   npm run dev

## Usage

- Visit http://localhost:4400 to access the home page.
- Use the provided routes for registration, login, and logout.
  
## Folder Structure

- public/: Static assets (CSS, images, etc.).
- views/: EJS templates for rendering HTML views.
- routes/: Express route handlers for different endpoints.
- models/: Mongoose models for defining the schema.
- middlewares/: Custom middleware functions (e.g., authentication).
 - app.js: Main application file.

## Contributing

- Contributions are welcome! If you have any suggestions or want to improve this project, please open an issue or create a pull request.

