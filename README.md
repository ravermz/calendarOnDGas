# Calendario On D Gas

Este proyecto es un calendario donde se pueden agregar, editar y eliminar eventos. Además, incluye funcionalidades adicionales como predicción del clima y selección automática de la zona horaria basada en la ciudad ingresada.

## Cómo ejecutar el proyecto localmente

### Prerrequisitos

- Node.js versión 14 o superior.
- npm o yarn instalado.
- Docker (opcional, si deseas levantar la base de datos en un contenedor).

### Pasos para correr el proyecto

#### Clonar el repositorio

Primero, clona el repositorio y entra al directorio:

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

#### Correr el proyecto solo con DOCKER
Si deseas usar Docker, con solo este comando montarás la base de datos y correra el proyecto, es decir, solo con docker y este comando podrás usar el proyecto:

```bash
docker-compose up -d
```

#### Instalar las dependencias

Instala las dependencias necesarias:

```bash
npm install
```

o si prefieres usar yarn:

```bash
yarn install
```

#### Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:

```env
DATABASE_URL=tu_url_de_la_base_de_datos
WEATHER_API_KEY=tu_api_key_del_clima
```

- `DATABASE_URL`: La URL de conexión a tu base de datos PostgreSQL.
- `WEATHER_API_KEY`: Tu API key del servicio de clima (por ejemplo, WeatherAPI).

Si estás usando una base de datos local con Docker, puedes usar la URL que se proporciona en el archivo `docker-compose.yml`.

#### Configurar la base de datos

Para, aplica las migraciones de Prisma para crear las tablas necesarias:

```bash
npx prisma migrate dev --name init
```

> **Nota sobre Prisma**: Utilizo Prisma como ORM para interactuar con la base de datos. Esto facilita las operaciones CRUD y mantiene el esquema de la base de datos sincronizado con el modelo de datos de la aplicación.

#### Ejecutar la aplicación

Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Cómo correr los tests

Para ejecutar los tests unitarios y de integración, simplemente corre:

```bash
npm test
```

Esto ejecutará todos los tests configurados con Jest y React Testing Library.

## Decisiones técnicas importantes

- **Uso de Next.js**: Elegí Next.js porque facilita el enrutamiento y ofrece ventajas para el renderizado del lado del servidor, lo cual mejora el rendimiento de la aplicación.

- **Manejo de fechas y zonas horarias**: Implementé `date-fns` y `date-fns-tz` para manejar correctamente las fechas y las zonas horarias. Así me aseguro de que los eventos no cruzan al día siguiente y que, si la hora de inicio es a las 23:00, la hora máxima de fin es a las 23:59.

- **Selección automática de zona horaria**: Cuando el usuario ingresa una ciudad, la aplicación ajusta automáticamente la zona horaria a la de esa ciudad utilizando una API externa. Si no se ingresa ninguna ciudad, el usuario puede seleccionar manualmente la zona horaria de una lista.

- **Pruebas unitarias y de integración**: Incluí tests para las funciones clave del calendario (agregar, editar, eliminar eventos) utilizando Jest y React Testing Library. Esto ayuda a asegurar que el código funciona como espero y facilita el mantenimiento a futuro.

- **Context API de React**: Utilicé el Context API para manejar el estado global de los eventos. De esta forma, puedo acceder y actualizar los eventos desde cualquier componente sin tener que pasar props innecesarias.

- **Uso de Prisma**: Prisma es el ORM que elegí para interactuar con la base de datos PostgreSQL. Me permite definir el esquema de la base de datos en el archivo `schema.prisma` y generar automáticamente los tipos TypeScript. Además, facilita la realización de migraciones y consultas a la base de datos de forma eficiente.

- **Predicción del clima**: Implementé una funcionalidad que obtiene el clima para la fecha y ubicación del evento utilizando una API externa (por ejemplo, WeatherAPI). Esto agrega valor al calendario al mostrar información relevante para el evento.

## Componentes principales

- **EventForm**: Componente responsable de agregar y editar eventos. Incluye campos para título, descripción, fecha y hora de inicio y fin, ubicación y opciones adicionales como todo el día.

- **ScheduleSection**: Subcomponente de `EventForm` que maneja la lógica y presentación de las fechas y horas del evento, asegurando que no cruzan al día siguiente y ajustando automáticamente la hora de fin.

- **LocationSection**: Permite al usuario ingresar una ciudad y, al hacerlo, actualiza automáticamente la zona horaria y obtiene la información del clima para esa ubicación.

- **EventItem**: Componente que representa un evento en la interfaz, mostrando la información relevante y permitiendo acciones como editar o eliminar.

- **EventStore**: Contexto de React que maneja el estado global de los eventos, incluyendo las operaciones de agregar, editar y eliminar, así como el manejo de notificaciones y estado de carga.

## Notas adicionales

- **Variables de entorno**: Asegúrate de configurar correctamente las variables de entorno necesarias (`DATABASE_URL` y `WEATHER_API_KEY`) tanto en tu entorno local como en producción.

- **API de Clima**: Utilicé el servicio de WeatherAPI para obtener la información del clima. Necesitarás crear una cuenta y obtener una API key para que la funcionalidad de clima funcione.

- **Despliegue**: Aunque no desplegué la aplicación en este momento, el proyecto está preparado para ser desplegado en cualquier plataforma que soporte aplicaciones Node.js. Si planeas desplegarlo, recuerda configurar las variables de entorno y la base de datos en tu entorno de producción.

## Conclusión

Este proyecto refleja mi experiencia y dedicación en el desarrollo de aplicaciones web robustas y funcionales. Estoy entusiasmado por la posibilidad de unirme al equipo de **Lemontech** y contribuir con mis habilidades al éxito de sus proyectos. Creo firmemente que juntos podemos enfrentar desafíos y alcanzar metas significativas.
