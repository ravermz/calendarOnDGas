# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Instala curl, bash, dockerize y postgresql-client (para esperar a la base de datos y ejecutar psql)
RUN apk add --no-cache curl bash postgresql-client && \
  curl -L https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
  | tar -C /usr/local/bin -xz

# Establece el directorio de trabajo
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copia los package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Copia el script de entrada y asegúrate de que tenga permisos de ejecución
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expone el puerto 3000
EXPOSE 3000

# Usa el script de entrada para la inicialización de Prisma y la ejecución de la aplicación
ENTRYPOINT ["/docker-entrypoint.sh"]

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]
