#!/bin/bash

# Espera a que PostgreSQL esté listo
echo "Esperando que la base de datos PostgreSQL esté lista..."

until npx prisma db pull > /dev/null 2>&1; do
  echo "PostgreSQL no está listo. Reintentando en 5 segundos..."
  sleep 5
done

echo "PostgreSQL está listo, ejecutando migraciones..."

# Ejecuta las migraciones de Prisma
npx prisma migrate dev

# Inicia la aplicación de Next.js
npm run dev
