# Contributing to Employee Management API

Thank you for your interest in contributing to the Employee Management API! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/employee-management-api.git
   cd employee-management-api
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic

### Database Changes
- Always create new migration files for schema changes
- Never modify existing migration files
- Test migrations thoroughly before committing

### API Development
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement comprehensive error handling
- Add input validation for all endpoints

### Testing
- Write tests for new features
- Ensure existing tests pass
- Test database operations thoroughly

## Submitting Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Add tests if applicable
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: descriptive commit message"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all tests pass

## Commit Message Guidelines

Use clear, descriptive commit messages:
- `Add: new feature or functionality`
- `Fix: bug fixes`
- `Update: changes to existing features`
- `Docs: documentation updates`
- `Refactor: code improvements without functionality changes`

## Issues and Bug Reports

When reporting issues:
- Use a clear, descriptive title
- Provide steps to reproduce
- Include error messages and logs
- Specify your environment (OS, Node.js version, etc.)

## Feature Requests

For new features:
- Describe the use case
- Explain the expected behavior
- Consider backward compatibility
- Discuss implementation approach

## Code Review Process

All contributions go through code review:
- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

Thank you for contributing! 🚀