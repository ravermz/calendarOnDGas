#!/bin/bash

DB_HOST="db"
DB_PORT="5432"
DB_NAME="calendar_on_d_gas"
DB_USER="postgres"
DB_PASSWORD="postgres"

echo "Esperando que la base de datos PostgreSQL esté lista..."

until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "Postgres no está listo. Reintentando en 5 segundos..."
  sleep 5
done

if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\dt' | grep -q "_prisma_migrations"; then
  echo "La tabla _prisma_migrations ya existe, saltando migraciones..."
else
  echo "Ejecutando migraciones de Prisma..."
  npx prisma migrate dev --name init
fi

exec "$@"
