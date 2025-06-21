# Crypto Price Alert Service

A scalable, event-driven backend service for setting up cryptocurrency price alerts.  
Built with Node.js (TypeScript), MongoDB, Redis, and Docker.  
Includes asynchronous processing, robust security, and modern DevOps practices.
Deployed on AWS EC2.

---

## Features

- User registration & login (JWT authentication)
- Create, list, update, and delete crypto price alerts
- MongoDB for persistent storage
- Redis for caching and Pub/Sub (event bus)
- Worker service for scheduled alert checks
- Asynchronous, event-driven architecture (Redis Pub/Sub, Kafka-ready)
- Swagger API documentation
- Rate limiting, input validation (Joi), and secure password storage
- Winston-based logging
- Unit & integration tests (Jest, Supertest)
- Dockerized deployment
- Prometheus & Grafana for monitoring

---

## Architecture & Design

### **System Overview**

```
+-------------------+      Pub/Sub      +---------------------+
|    Worker         |------------------>| NotificationService |
| (Alert Evaluator) |                   +---------------------+
+-------------------+                           |
        |                                       |
        | REST API                              v
+-------------------+                    +-------------------+
|    API Server     |<-------------------|     Redis         |
+-------------------+                    +-------------------+
        |                                       ^
        | REST API                              |
+-------------------+                    +-------------------+
|   MongoDB        |<--------------------|   Prometheus      |
+-------------------+                    +-------------------+
```

- **API Server**: Handles user/auth/alert endpoints, validates input, and manages users/alerts in MongoDB.
- **Worker**: Periodically checks crypto prices, evaluates alerts, and publishes events to Redis Pub/Sub.
- **Notification Service**: Subscribes to Redis events and sends notifications (console/log for demo).
- **Redis**: Used for caching prices and as an event bus.
- **MongoDB**: Stores users and alerts.
- **Prometheus/Grafana**: For metrics and monitoring.

---

### **Why These Technologies?**

- **Node.js (TypeScript)**: Modern, scalable, and type-safe backend development.
- **MongoDB**: Flexible schema for user and alert data.
- **Redis**: Fast in-memory cache and lightweight event bus (Pub/Sub).
- **Docker**: Easy local development, testing, and cloud deployment.
- **Joi**: Reliable input validation.
- **Winston**: Structured, persistent logging.
- **Prometheus/Grafana**: Industry-standard monitoring and visualization.
- **Kafka (optional)**: For enterprise-grade, persistent, distributed event streaming (see below).

---

## Asynchronous & Event-Driven Design

- **Alert evaluation** and **notification delivery** are decoupled using Redis Pub/Sub.
- The worker publishes an event when an alert is triggered.
- The notification service listens for these events and processes notifications asynchronously.
- This design is scalable and easily extensible (e.g., add more notification channels or consumers).

---

## Kafka Integration (How-To)

To scale event processing, you can replace Redis Pub/Sub with **Apache Kafka**:

1. **Add Kafka to docker-compose.yml:**
    ```yaml
    kafka:
      image: bitnami/kafka:latest
      ports:
        - "9092:9092"
      environment:
        KAFKA_BROKER_ID: 1
        KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
        KAFKA_LISTENERS: PLAINTEXT://:9092
        KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      depends_on:
        - zookeeper

    zookeeper:
      image: bitnami/zookeeper:latest
      ports:
        - "2181:2181"
    ```

2. **Install Kafka client:**
    ```bash
    npm install kafkajs
    ```

3. **Publish events from the worker:**
    ```typescript
    import { Kafka } from 'kafkajs';
    const kafka = new Kafka({ brokers: ['kafka:9092'] });
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: 'alerts',
      messages: [{ value: JSON.stringify({ alertId, userId, price }) }],
    });
    ```

4. **Subscribe and handle events in the notification service:**
    ```typescript
    const consumer = kafka.consumer({ groupId: 'notification-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'alerts', fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        // Parse and handle alert notification
      },
    });
    ```
    
---

## Cloud Deployment (AWS EC2)

- The application is deployed on AWS EC2 using Docker Compose.
- Required ports (e.g., 3000) are opened in the EC2 security group.
- MongoDB and Redis run as containers on the same machine via Docker Compose.
- Environment variables are managed with a `.env` file.
- For production, you can use managed services like MongoDB Atlas and AWS Elasticache.

---

## Setup Instructions

### **Manual Setup**

```bash
git clone <repo-url>
cd crypto-price-alert
npm install
cp .env.example .env
npm run build
npm start
```

### **Docker Compose**

```bash
docker compose up --build
```

- API: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Testing

### **Run all tests locally**
```bash
npm test
```

### **Run tests in Docker**
```bash
docker compose up --build test
```

---

## API Documentation

Swagger UI: [http://16.170.69.224:3000/api-docs](http://16.170.69.224:3000/api-docs)

**Example:**
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `POST /api/alerts` — Create a new alert (JWT required)
- `GET /api/alerts` — List user alerts (JWT required)

---

## CI/CD & Deployment

- **CI/CD**: Use GitHub Actions for lint, test, and Docker build steps.
- **Example Workflow:**
    ```yaml
    name: CI/CD
    on: [push]
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with:
              node-version: 20
          - run: npm ci
          - run: npm run lint
          - run: npm test
          - run: npm run build
          - uses: docker/build-push-action@v5
            with:
              push: true
              tags: ${{ secrets.ECR_REGISTRY }}/crypto-alert:latest
    ```
- **Deployment**: Push Docker images to AWS ECR, deploy to ECS/EKS.

---

## 🔒 Security & Best Practices

- JWT ile authentication - !!!! Don't forget to get the returned value after logging in.
- Rate limiting
- Input validation (Joi)
- Password hashing (bcrypt)
- Centralized error handling
- Logging (Winston)
- Environment variables for secrets

---

## 📈 Monitoring

- **Prometheus**: Metrics endpoint (`/metrics`) exposed for scraping.
- **Grafana**: Visualize metrics from Prometheus.
- **Winston**: All logs are structured and persistent.
