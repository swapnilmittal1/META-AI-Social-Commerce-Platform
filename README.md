
---

```yaml
---
title: "Meta BE Full Demo: How to Run"
author: "Swapnil Mittal"
output:
  github_document: default
---
```

```markdown
## Introduction

Welcome to the **Meta Business Engineering Full Demo** repository. This project demonstrates a multi-service architecture integrating with Meta’s platforms. Below are **step-by-step instructions** on how to run the system locally via Docker.

---

## Prerequisites

- **Docker** and **Docker Compose** installed on your machine

---

## Environment Variables

Create a `.env` file at the project root with at least the following environment variables (adjust values as needed):

```
POSTGRES_DB=meta_demo
POSTGRES_USER=meta_user
POSTGRES_PASSWORD=meta_pass

FB_APP_ID=YOUR_FACEBOOK_APP_ID
FB_APP_SECRET=YOUR_FACEBOOK_APP_SECRET
FB_VERIFY_TOKEN=YOUR_CUSTOM_WEBHOOK_VERIFY_TOKEN
WITAI_SERVER_TOKEN=YOUR_WITAI_SERVER_TOKEN

JWT_SECRET=SUPER_SECRET_JWT_KEY
```

> **Note**: **Never** commit real secrets or tokens to public repositories. Use a secrets manager in production.

---

## Build and Run with Docker

```sh
# 1) Build images
docker-compose build

# 2) Start containers
docker-compose up
```

This will:
- Spin up the **Postgres** database
- Build and run each microservice:
  - **User Service** (port 7001)
  - **Product Service** (port 7002)
  - **Order Service** (port 7003)
  - **Chatbot Service** (port 9000, listens for Messenger/WhatsApp webhooks)
  - **Recommendation Service** (port 7004)
  - **Gateway** (port 8000, central API aggregator)
  - **Frontend** (React app on port 3000)

---

## Accessing Each Component

1. **Frontend**: [http://localhost:3000](http://localhost:3000)  
2. **Gateway**: [http://localhost:8000](http://localhost:8000)  
3. **User Service**: [http://localhost:7001](http://localhost:7001)  
4. **Product Service**: [http://localhost:7002](http://localhost:7002)  
5. **Order Service**: [http://localhost:7003](http://localhost:7003)  
6. **Chatbot Service**: [http://localhost:9000](http://localhost:9000) (webhook endpoint at `/webhook`)  
7. **Recommendation Service**: [http://localhost:7004](http://localhost:7004)

---

## Initial Setup

1. **Register a new user**:
   - In the React frontend, navigate to **`/register`**.
   - Create an account by providing your **email** and **password**.
   
2. **Log in**:
   - Go to **`/login`** and enter your credentials.
   - The app will store your **JWT token** in memory (if you adapted the example code).

3. **Add and manage products**:
   - Navigate to **`/products`** (only accessible if logged in).
   - Create new products by filling in title, description, price, and optional image URL.
   - Once created, they appear in the product list.

4. **Sync products to Facebook** (optional):
   - You will need a **Page Access Token** and a **Catalog ID** from your Meta account.
   - Click **“Sync to Facebook”** next to a product, then provide the token and catalog ID in the prompts.

5. **Create and view orders**:
   - Navigate to **`/orders`**.
   - For a real user flow, your frontend or some external integration would post to **`/api/orders`** with items and totals. In the sample UI, you can see existing orders, pay them, or update their status.

6. **Recommendations**:
   - On the **Dashboard** (`/`), you’ll see a simple recommendation list driven by the **Recommendation Service**, which randomly selects products from the database.

---

## Messenger Chatbot Setup

1. **Facebook App Setup**:
   - Go to [developers.facebook.com](https://developers.facebook.com) and create or configure a Facebook App.
   - Under **Messenger** settings, add a **Webhook** for page events:  
     - **Callback URL**: `http://<YOUR_DOMAIN_OR_IP>:9000/webhook`  
     - **Verify Token**: Matches the `FB_VERIFY_TOKEN` in `.env`

2. **Wit.ai Integration** (optional, for NLP):
   - Create or configure a Wit.ai app.  
   - In the `.env`, set `WITAI_SERVER_TOKEN` to your Wit.ai **Server Access Token**.

3. **Testing**:
   - Send a message to your Facebook Page from another account.  
   - The chatbot should receive it (via the **Chatbot Service** at port 9000) and respond with basic NLP or fallback logic.

---

## Common Troubleshooting

- **Ports already in use**: Ensure ports 3000, 8000, 7001-7004, and 9000 are free or adjust in `docker-compose.yml`.
- **Webhook verification fails**: Double-check `FB_VERIFY_TOKEN` is consistent.
- **Wit.ai not responding**: Confirm you have the correct Wit.ai server token and your Wit.ai app is published.
- **Database connection issues**: Verify the environment variables in `.env` match your Docker Compose settings.

---

## Next Steps

- **Production Deployment**: Move from Docker Compose to a cloud orchestration platform (Kubernetes, AWS ECS, etc.).  
- **Continuous Integration**: Add a CI pipeline (GitHub Actions, Jenkins) to lint, test, and build images.  
- **Monitoring & Logging**: Incorporate logging (e.g., Winston, Morgan), error tracking (Sentry), and metrics (Prometheus, Grafana).  
- **Scaling**: Switch to microservice orchestration in production, scaling services independently as load increases.  
- **Security**: Use HTTPS, manage secrets in a vault, and harden your services with role-based access control.

---