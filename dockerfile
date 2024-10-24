# Etapa de construcción
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar archivos desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Instalar 'wait-for' para manejar dependencias
RUN apk add --no-cache bash curl
ADD https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for /wait-for
RUN chmod +x /wait-for

# Exponer el puerto 3000
EXPOSE 3000

# Comando de inicio que espera a que la base de datos esté lista para darle con todo al proyecto
CMD ["/wait-for", "db:5432", "--", "npm", "run", "start:migrate"]
