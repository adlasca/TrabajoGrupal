# API REST Helidon SE 4.5
## Docente: Jaime Salvador M.
## Grupo 4:

| Integrantes                      | CI         |
|:---------------------------------|:-----------|
| Ángelo Damian Lascano Puruncajas | 1750337360 |
| Pamela Nicole Fernandez Espinoza | 175337360  |
| Billy Steven Moreno Chinataxi    | 175337360  |


## Tabla de mapeo

| Dependencia a ELIMINAR                        | Módulo Helidon SE 4.5 que la sustituye                                                          |
|:----------------------------------------------|:------------------------------------------------------------------------------------------------|
| `org.jboss.resteasy:resteasy-core`            | `io.helidon.webserver:helidon-webserver`                                                        |
| `org.jboss.resteasy:resteasy-undertow-cdi`    | *(no requerido; Helidon SE no usa CDI)*                                                         |
| `org.jboss...:resteasy-json-binding-provider` | `io.helidon.http.media:helidon-http-media-jsonb`                                                |
| `org.hibernate.orm:hibernate-core`            | `io.helidon.dbclient:helidon-dbclient:4.5` +<br>`io.helidon.dbclient:helidon-dbclient-jdbc:4.5` |
| *(sin equivalente directo)*                   | `io.helidon.dbclient:helidon-dbclient-hikari:4.5`<br>*(pool de conexiones)*                     |
| *(sin equivalente directo)*                   | `io.helidon.config:helidon-config-yaml:4.5`<br>*(runtime)*                                      |
| `org.postgresql:postgresql`                   | **conservar** (driver JDBC)                                                                     |
| `io.freefair.lombok`                          | **conservar**                                                                                   |

### Tabla de Versiones del Frontend
### Tabla de Versiones del Frontend

| Tecnología / Librería               | Versión Utilizada | Rol en el Proyecto                                                           |
|:------------------------------------|:-----------------:|:-----------------------------------------------------------------------------|
| **React**                           |     `^19.2.7`     | Librería principal para el desarrollo de interfaces de usuario               |
| **React DOM**                       |     `^19.2.7`     | Motor de renderizado de React en el navegador web                            |
| **Vite**                            |     `^8.1.1`      | Entorno de desarrollo de alta velocidad y empaquetador web                   |
| **React Router DOM**                |     `^7.9.4`      | Gestión de enrutamiento y navegación SPA (Single Page Application)           |
| **Redux Toolkit**                   |     `^2.12.0`     | Gestor de estado global de la aplicación (arquitectura de *slices*)          |
| **React Redux**                     |     `^9.3.0`      | Librería de integración para conectar Redux con los componentes de React     |
| **Axios**                           |     `^1.18.1`     | Cliente HTTP para el consumo de la API REST del backend en Helidon           |
| **TypeScript**                      |     `~6.0.2`      | Superconjunto de JavaScript que aporta tipado estático y seguridad de código |
| **MUI Icons (@mui/icons-material)** |     `^9.2.0`      | Librería de iconos vectoriales de Material Design para la interfaz           |
| **Emotion (@emotion/react)**        |    `^11.14.0`     | Motor de estilos y estilizado de componentes (CSS-in-JS)                     |


### Diagrama de Paquetes y Arquitectura

####  Backend (Java / Helidon SE 4.5)
El backend está estructurado en paquetes siguiendo una arquitectura de capas limpia:

### Diagrama de Paquetes del Backend (Java / Helidon SE 4.5)

El backend está desarrollado bajo una arquitectura modular por capas, separando estrictamente el modelado de datos, el acceso a la base de datos relacional y el enrutamiento HTTP:

```text
org.web
│
├── db/                   --> Capa de Dominio (Java Records / Entidades DTO)
│   ├── Album.java
│   ├── Comment.java
│   ├── Photo.java
│   ├── Post.java
│   ├── Todo.java
│   └── User.java
│
├── respositories/        --> Capa de Acceso a Datos (Consultas SQL mediante Helidon DbClient)
│   ├── AlbumRepository.java
│   ├── CommentRepository.java
│   ├── PhotoRepository.java
│   ├── PostRepository.java
│   ├── TodoRepository.java
│   └── UserRepository.java
│
├── services/             --> Capa de Enrutamiento, Servicios y Lógica de Negocio
│   ├── AlbumService.java
│   ├── CommentService.java
│   ├── DbService.java
│   ├── PhotoService.java
│   ├── PostService.java
│   ├── TodoService.java
│   ├── UserService.java
│   └── impl/
│       ├── AlbumImpl.java
│       ├── CommentImpl.java
│       ├── PhotoImpl.java
│       ├── PostImpl.java
│       ├── TodoImpl.java
│       └── UserImpl.java
│
├── utils/                --> Utilidades e Interceptores de Gestión de Errores
│   ├── ExceptionHandler.java
│   └── GlobalException.java
│
└── Main.java             --> Punto de entrada principal y registro del WebServer
```


### Diagrama de Paquetes y Arquitectura

#### Frontend (React + TypeScript + Vite + Redux Toolkit)
El frontend adopta una arquitectura orientada a funcionalidades (*Feature-Driven Architecture*), separando las capas de red, los tipos estáticos, el estado global modularizado y las interfaces de usuario de forma escalable:

```text
src/
│
├── api/                  --> Configuración del cliente HTTP y base de la API REST
│   └── axiosConfig.ts
│
├── components/           --> Componentes UI visuales y estructurales reutilizables
│   └── NavBar.tsx
│
├── features/             --> Módulos de estado global (Slices de Redux Toolkit por entidad)
│   ├── albums/
│   │   └── albumSlice.ts
│   ├── comments/
│   │   └── commentSlice.ts
│   ├── photos/
│   │   └── photosSlice.ts
│   ├── posts/
│   │   └── postSlice.ts
│   ├── todos/
│   │   └── todosSlice.ts
│   └── users/
│       └── userSlice.ts
│
├── hooks/                --> Custom Hooks para consumo tipado del store
│   └── redux.ts
│
├── models/               --> Interfaces y contratos estáticos de TypeScript (espejo del DTO)
│   ├── Album.ts
│   ├── Comment.ts
│   ├── Photo.ts
│   ├── Post.ts
│   ├── Todo.ts
│   └── User.ts
│
├── pages/                --> Vistas de la aplicación conectadas a las rutas de React Router
│   ├── About.tsx
│   ├── Albums.tsx
│   ├── CommentForm.tsx
│   ├── Comments.tsx
│   ├── Home.tsx
│   ├── Photos.tsx
│   ├── PostDetail.tsx
│   ├── Posts.tsx
│   ├── Todos.tsx
│   ├── UserAlbums.tsx
│   ├── UserDetail.tsx
│   ├── UserPosts.tsx
│   ├── Users.tsx
│   └── UserTodos.tsx
│
├── store/                --> Configuración centralizada del Store de Redux
│   └── index.ts
│
├── App.tsx               --> Enrutador principal y layout de la Single Page Application (SPA)
└── main.tsx              --> Punto de entrada, montaje del DOM e inyección de Providers
```


# Capturas de los endpoint en ejecución
## - User
### FindById
![](images/Back/UserId.jpg)
### FindAll
![](images/Back/UsersFindAll.png)
### CREATE
![](images/Back/UserCreate.jpg)
### PUT (UPDATE)
![](images/Back/UserPut.jpg)
### DELETE
![](images/Back/UserDelete.jpg)
## Post
### FindById
![](images/Back/PostGetId.jpg)
### FindAll
![](images/Back/PostFindAll.jpg)
### CREATE
![](images/Back/PostCreate.jpg)
### PUT (UPDATE)
![](images/Back/PostPut.jpg)
### DELETE
![](images/Back/PostDelete.jpg)
## Comment
### FindById
![](images/Back/CommentId.jpg)
### FindAll
![](images/Back/CommentGetAll.jpg)
### CREATE
![](images/Back/CommentPost.jpg)
### PUT (UPDATE)
![](images/Back/CommentPut.jpg)
### DELETE
![](images/Back/CommentDelete.jpg)
## Album
### FindById
![](images/Back/AlbumsGetId.jpg)
### FindAll
![](images/Back/AlbumsGetAll.jpg)
### CREATE
![](images/Back/AlbumsPost.jpg)
### PUT (UPDATE)
![](images/Back/AlbumsPut.jpg)
### DELETE
![](images/Back/AlbumsDelete.jpg)
## Photo
### FindById
![](images/Back/PhotosGetId.jpg)
### FindAll
![](images/Back/PhotosGETAll.jpg)
### CREATE
![](images/Back/PhotoPost.jpg)
### PUT (UPDATE)
![](images/Back/PhotosPut.jpg)
### DELETE
![](images/Back/PhotosDelete.jpg)
## Todo
### FindById
![](images/Back/TodoGetId.jpg)
### FindAll
![](images/Back/TodosGetAll.jpg)
### CREATE
![](images/Back/TodoPost.jpg)
### PUT (UPDATE)
![](images/Back/TodoPut.jpg)
### DELETE
![](images/Back/TodoDelete.jpg)


# Capturas de la aplicación Web

---

---
## Instrucciones y Orden de Ejecución

Para garantizar el correcto funcionamiento del sistema Full-Stack sin errores de conexión ni dependencias huérfanas, es **obligatorio seguir el orden estricto de arranque** que se describe a continuación:

---

###  Paso 1: Base de Datos (PostgreSQL)
Antes de iniciar el servidor Java, el motor de base de datos relacional debe estar activo y accesible:
1. Asegurarse de que **PostgreSQL** esté ejecutándose en el puerto por defecto (`5432`).
2. Verificar que exista la base de datos configurada en el proyecto (`progweb`) con las credenciales correspondientes al archivo `application.yaml` (`username: postgres`, `password: password`).

---

###  Paso 2: Servidor Backend (Helidon SE 4.5)
Una vez que la base de datos está lista, se procede a levantar la API REST para que ejecute el DDL (creación de tablas) y abra el pool de conexiones HikariCP:
1. Abrir una terminal y navegar a la raíz de la carpeta del backend:
   ```bash
   cd TrabajoGrupal/
   ```
2. Compila y ejecuta el proyecto mediante el wrapper de Gradle incluido:
    ```bash
   gradlew run
   ```
3. Espera a que la consola confirme que el servidor HTTP nativo está inicializado y escuchando peticiones en el puerto 8080:
     ```
   WEB server is up! http://localhost:8080/api
    ```