# Star Wars Vehicles E-commerce 🚀# SwVehiclesEcommerce



Una aplicación de e-commerce moderna construida con Angular 20 que permite explorar y comprar vehículos del universo de Star Wars utilizando la [Star Wars API (SWAPI)](https://swapi.dev/).This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.



## 🌟 Características## Development server



- **Arquitectura Moderna**: Standalone Components como base arquitectónicaTo start a local development server, run:

- **Reactive Programming**: Combinación de Signals, RxJS y APIs funcionales

- **Server-Side Rendering**: SSR con Hydration incremental para mejor rendimiento y SEO```bash

- **Optimización de Imágenes**: Implementación con `NgOptimizedImage`ng serve

- **Testing Completo**: Jest para tests unitarios y Cypress para tests E2E```

- **CI/CD**: Pipeline completo con GitHub Actions

- **Accesibilidad**: Implementación de estrategias de accesibilidad webOnce the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

- **Diseño Responsive**: Interfaz elegante y adaptable a todos los dispositivos

## Code scaffolding

## 🛠️ Tecnologías Utilizadas

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

- **Frontend**: Angular 20, TypeScript, SCSS

- **State Management**: Angular Signals```bash

- **HTTP Client**: Angular HttpClient con fetch APIng generate component component-name

- **Testing**: Jest, Cypress```

- **Build Tool**: Angular CLI

- **CI/CD**: GitHub ActionsFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

- **Deployment**: GitHub Pages

```bash

## 🚀 Instalación y Usong generate --help

```

### Prerrequisitos

## Building

- Node.js (v18.x o superior)

- npm o yarnTo build the project run:

- Git

```bash

### Instalaciónng build

```

1. Clona el repositorio:

```bashThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

git clone https://github.com/tu-usuario/sw-vehicles-ecommerce.git

cd sw-vehicles-ecommerce## Running unit tests

```

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

2. Instala las dependencias:

```bash```bash

npm installng test

``````



3. Inicia el servidor de desarrollo:## Running end-to-end tests

```bash

npm startFor end-to-end (e2e) testing, run:

```

```bash

4. Abre tu navegador en `http://localhost:4200`ng e2e

```

## 📁 Estructura del Proyecto

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

```

src/## Additional Resources

├── app/

│   ├── core/                 # Servicios centrales y modelosFor more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

│   │   ├── models/          # Interfaces y tipos
│   │   ├── services/        # Servicios de datos
│   │   └── guards/          # Guards de ruta
│   ├── features/            # Módulos de funcionalidades
│   │   ├── vehicles/        # Gestión de vehículos
│   │   └── cart/           # Carrito de compras
│   ├── shared/             # Componentes reutilizables
│   │   ├── components/     # Componentes compartidos
│   │   ├── pipes/          # Pipes personalizados
│   │   └── directives/     # Directivas
│   └── app.ts              # Componente raíz
├── assets/                 # Recursos estáticos
└── styles.scss            # Estilos globales
```

## 🧪 Testing

### Tests Unitarios (Jest)
```bash
# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Tests E2E (Cypress)
```bash
# Ejecutar tests E2E
npm run e2e

# Abrir interfaz de Cypress
npm run e2e:open
```

## 🏗️ Build

### Desarrollo
```bash
npm run build
```

### Producción
```bash
npm run build:prod
```

### Server-Side Rendering
```bash
npm run serve:ssr
```

## 🔄 CI/CD Pipeline

El proyecto incluye un pipeline completo de CI/CD con GitHub Actions que:

- Ejecuta tests unitarios y E2E
- Verifica la calidad del código
- Construye la aplicación para producción
- Ejecuta auditorías de seguridad
- Despliega automáticamente en GitHub Pages

## 🎨 Funcionalidades de la Aplicación

### 🏠 Página de Inicio
- Hero section con call-to-actions
- Sección de características destacadas
- Vehículos featured
- Estadísticas de la plataforma

### 🚗 Catálogo de Vehículos
- Listado completo de vehículos y naves espaciales
- Filtros por tipo (vehículos/naves)
- Búsqueda por nombre, modelo o fabricante
- Paginación y carga lazy

### 📱 Detalle del Vehículo
- Información completa del vehículo
- Especificaciones técnicas
- Gestión de cantidad
- Agregado al carrito

### 🛒 Carrito de Compras
- Gestión completa del carrito
- Persistencia en localStorage
- Cálculo de totales
- Interfaz intuitiva para modificar cantidades

## 🌐 API Integration

La aplicación consume la [Star Wars API (SWAPI)](https://swapi.dev/) para obtener:

- Información de vehículos
- Datos de naves espaciales
- Detalles de películas relacionadas

## 🔒 Seguridad y Accesibilidad

### Seguridad
- Validación de datos de entrada
- Sanitización de contenido
- Headers de seguridad configurados
- Auditorías automáticas de dependencias

### Accesibilidad
- Cumplimiento con WCAG 2.1
- Navegación por teclado
- Lectores de pantalla compatibles
- Contraste adecuado de colores
- Estados de focus visibles

## 📊 Performance

- **SSR**: Server-Side Rendering para mejor SEO y tiempo de carga
- **Lazy Loading**: Carga diferida de componentes
- **NgOptimizedImage**: Optimización automática de imágenes
- **Tree Shaking**: Eliminación de código no utilizado
- **Bundling**: Optimización de bundles para producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Star Wars API](https://swapi.dev/) por proporcionar los datos
- La comunidad de Angular por las herramientas y documentación
- Los contribuidores de las librerías utilizadas

---

**Que la Fuerza te acompañe** ⚡

## 📞 Contacto

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

---

*Este proyecto fue creado con fines educativos y de demostración.*