FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN SECRET_KEY=build-placeholder DB_NAME=placeholder DB_USER=placeholder DB_PASSWORD=placeholder DB_HOST=placeholder python manage.py collectstatic --noinput

EXPOSE 8000

# start.sh: migrate → ensure_superuser → gunicorn
# Migrations run at container start (not during build) because the
# database is not available at build time.
CMD ["bash", "start.sh"]
