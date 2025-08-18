# Deployment Guide

This guide covers deploying the Employee Management API to various platforms.

## Environment Variables

Ensure these environment variables are set in production:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=employee_management_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Optional: Database SSL (for cloud databases)
DB_SSL=true
```

## Database Setup for Production

### 1. Cloud PostgreSQL Options
- **AWS RDS PostgreSQL**
- **Google Cloud SQL**
- **Azure Database for PostgreSQL**
- **Heroku Postgres**
- **DigitalOcean Managed Databases**

### 2. Database Migration
```bash
# Run migrations in production
npm run migrate
```

## Deployment Platforms

### Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL Add-on**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Run Migrations**
   ```bash
   heroku run npm run migrate
   ```

### AWS EC2

1. **Launch EC2 Instance**
2. **Install Node.js and PostgreSQL**
3. **Clone Repository**
4. **Install Dependencies**
   ```bash
   npm install --production
   ```
5. **Set Environment Variables**
6. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name employee-api
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     api:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DB_HOST=postgres
       depends_on:
         - postgres
     
     postgres:
       image: postgres:15
       environment:
         - POSTGRES_DB=employee_management_db
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### DigitalOcean App Platform

1. **Connect GitHub Repository**
2. **Configure Build Settings**
   - Build Command: `npm install`
   - Run Command: `npm start`
3. **Add Database Component**
4. **Set Environment Variables**
5. **Deploy**

## Production Considerations

### Security
- [ ] Implement authentication and authorization
- [ ] Add rate limiting
- [ ] Use HTTPS/SSL certificates
- [ ] Sanitize user inputs
- [ ] Implement CORS properly
- [ ] Add request logging

### Performance
- [ ] Database connection pooling
- [ ] Query optimization
- [ ] Caching (Redis)
- [ ] Load balancing
- [ ] CDN for static assets

### Monitoring
- [ ] Application monitoring (New Relic, DataDog)
- [ ] Error tracking (Sentry)
- [ ] Database monitoring
- [ ] Health checks
- [ ] Logging aggregation

### Backup and Recovery
- [ ] Database backups
- [ ] Disaster recovery plan
- [ ] Data retention policies

### Scaling
- [ ] Horizontal scaling
- [ ] Database read replicas
- [ ] Microservices architecture
- [ ] Container orchestration (Kubernetes)

## Health Checks

The API includes a health check endpoint at `/health` that returns:
- API status
- Database connection status
- System information

Use this for load balancer health checks and monitoring.

## SSL/HTTPS

For production, always use HTTPS. You can:
1. Use a reverse proxy (Nginx) with SSL certificates
2. Use cloud provider SSL termination
3. Use services like Cloudflare

## Environment-Specific Configurations

Create different configuration files for different environments:
- `config/development.js`
- `config/production.js`
- `config/test.js`

## Continuous Deployment

Set up CI/CD pipelines using:
- GitHub Actions
- GitLab CI/CD
- Jenkins
- CircleCI

Example GitHub Actions workflow:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```