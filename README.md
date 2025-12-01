# YenaEcommerce

Full-stack e-commerce example (Django backend + modern TypeScript React frontend). This README is written for maintainers and deployers and explains the repo layout, core functionality, how to run locally, deploy guidance, troubleshooting, and next steps.

---

## Table of contents

- About
- High-level architecture
- Repo structure (key files/folders)
- Core functionality and important flows
- Local development (setup & run)
- Running tests & checks
- Deployment guidance (Render and Docker) and common gotchas
- Environment variables
- Troubleshooting (Mail sending, bcc, DisallowedHost, system packages)
- Contributing & development tips
- Next steps / Improvements

---

## About

YenaEcommerce is an e-commerce application split into two main parts:

- `server/` — Django REST API and admin (Python). Responsible for product/catalog, carts, orders, accounts/auth, payments, and email flows.
- `client/` — React + TypeScript frontend built with Vite. Implements storefront UI, cart, checkout, authentication, and product pages.

This repository is organized as a monorepo to keep frontend and backend aligned for local development and deployments.

---

## High-level architecture

- Backend: Django (4.2.x) with Django REST Framework. Authentication uses JWT (simplejwt) and a cookie-based shim (custom `accounts.authentication`). Email sending is supported via MailerSend SDK and Anymail. The backend stores data in `db.sqlite3` by default (development).

- Frontend: Vite + React + TypeScript. Uses REST endpoints under `/api/...` to interact with the backend.

- Deployment: Designed to run on a PaaS (Render) or via Docker. A `requirements.txt` and minimal deploy instructions are in `server/`.

---

## Repo structure (excerpt)

Root folders:

- `client/` — React frontend
  - `src/` — React components, API client, pages
  - `package.json`, `vite.config.ts`, `tsconfig.json`
- `server/` — Django backend
  - `core/` — Django project settings/utilities
  - `accounts/`, `products/`, `carts/`, `order/`, `home/` — Django apps
  - `manage.py`, `requirements.txt`, `db.sqlite3`
  - `env/` — local virtualenv (not committed in a clean repo)

Important files you’ll refer to often:

- `server/manage.py` — Django CLI
- `server/core/settings.py` — all runtime settings (CORS, ALLOWED_HOSTS, email key config)
- `server/requirements.txt` — Python dependencies
- `client/package.json` — frontend dependencies & scripts
- `server/accounts/serializers/password_reset.py` — password reset serializer and reset-link builder

---

## Core functionality and flows

This section describes the most important flows implemented by the project.

1. Authentication & accounts
   - Custom `accounts.User` model used (see `server/accounts/models.py`).
   - JWT issued with Simple JWT and a custom cookie-based auth bridge in `accounts.authentication`.
   - Password reset flow builds a reset link and prints it (see serializer). The project may use MailerSend for actual emails if `MAILERSEND_API_KEY` is configured.

2. Product & catalog
   - `products` app exposes product list, search, and detail endpoints.
   - Images are stored in project folders like `product_images/` or `assets/img/products/` (development). In production, use object storage.

3. Cart & orders
   - `carts` app manages cart sessions and cart endpoints.
   - `order` app converts carts to orders and contains order models and status.

4. Email
   - The project can send transactional emails using MailerSend (the `mailersend` Python SDK) and/or Django Anymail adapters. See `core/settings.py` for `MAILERSEND_API_KEY` and `anymail` settings.

5. Payments
   - Payment integrations reference keys like `CHAPA_SECRET_KEY` (configured via environment variables).

---

## Local development — quick start

Assumes Linux/macOS and Python 3.12+ installed and Node 18+ for frontend.

1. Backend: create a virtualenv and install deps

```bash
# from repo root
cd server
python -m venv env
source env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

2. Frontend: install and run

```bash
cd ../client
npm install
npm run dev
```

3. Initialize backend DB & run

```bash
cd ../server
# create SQLite migrations / run initial migrations
source env/bin/activate
python manage.py migrate
# create superuser for admin
python manage.py createsuperuser
# run dev server (dev only)
ALLOWED_HOSTS_ORIGIN=http://localhost python manage.py runserver
```

Notes:
- `ALLOWED_HOSTS_ORIGIN` is read by `core/settings.py` to help CORS/CSRF during local dev.
- The repository includes a minimal `requirements.txt` tuned to deployable packages and a `requirements.full_backup.txt` with the original system-derived list.

---

## Running checks & tests

- Django system checks

```bash
source server/env/bin/activate
ALLOWED_HOSTS_ORIGIN=http://localhost python server/manage.py check
```

- Run unit tests (if present)

```bash
source server/env/bin/activate
python server/manage.py test
```

- Frontend lint/test (if configured in `client/package.json`)

```bash
cd client
npm run lint
npm test
```

---

## Deployment guidance (Render and Docker)

Two main options: direct PaaS (Render) or Docker-based deploy.

A. Deploy to Render (recommended quick path):

- Ensure `server/requirements.txt` contains the packages your runtime needs (Mailersend SDK, Anymail, Django, DRF, etc.).
- Add the environment variables in Render:
  - `MAILERSEND_API_KEY` (if emails required)
  - `CHAPA_SECRET_KEY` (or other payment keys)
  - Optionally set `ALLOWED_HOSTS` or rely on `RENDER_EXTERNAL_HOSTNAME`.
- Render runs `pip install -r requirements.txt` in the build. If you need system packages (e.g., for `bcc` / BPF), use a Docker deploy or Render buildhook to apt-get install them first.

B. Dockerfile (recommended for predictable builds)

Create a `Dockerfile` in `server/` which installs OS-level libs (if needed), then pip installs Python dependencies and runs `gunicorn`. Example (minimal):

```dockerfile
FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    # add any system libs your app needs here (bcc / libbcc-dev, clang, llvm, etc.)
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY server/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r /app/requirements.txt
COPY . /app
ENV PYTHONUNBUFFERED=1
CMD ["gunicorn","core.wsgi:application","--bind","0.0.0.0:8000"]
```

Use the Docker image with Render's Docker option or any container registry.

---

## Environment variables

Important variables used by the project (set in your environment or in Render):

- `SECRET_KEY` — Django secret key override (if not set, `core/settings.py` uses a fallback insecure string).
- `MAILERSEND_API_KEY` — API key for MailerSend (used by `mailersend` and Anymail config).
- `CHAPA_SECRET_KEY`, `CHAPA_CALLBACK_URL`, `CHAPA_RETURN_URL` — Payment provider keys and callbacks.
- `ALLOWED_HOSTS` — Comma-separated list of allowed hostnames for Django (optional; otherwise the code uses `RENDER_EXTERNAL_HOSTNAME` for Render).
- `RENDER_EXTERNAL_HOSTNAME` — Render sets this automatically; `core/settings.py` appends it to `ALLOWED_HOSTS`.
- `ALLOWED_HOSTS_ORIGIN` — Used to configure CORS origins / CSRF trusted origins for local dev.

