# Guía de Desarrollo - Star Wars Vehicles E-commerce

## 🚀 Inicio Rápido

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Build para producción
npm run build:prod

# Ejecutar tests
npm test

# Ejecutar tests E2E
npm run e2e:open
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/app/
├── core/                    # Servicios y modelos centrales
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── services/           # Servicios de datos y lógica de negocio
│   └── guards/             # Guards de rutas (futuro)
├── features/               # Funcionalidades principales
│   ├── vehicles/           # Módulo de vehículos
│   ├── cart/              # Módulo de carrito
│   └── home.component.ts   # Página de inicio
├── shared/                 # Componentes reutilizables
│   ├── components/         # Componentes compartidos
│   ├── pipes/             # Pipes personalizados (futuro)
│   └── directives/        # Directivas personalizadas (futuro)
└── app.ts                 # Componente raíz
```

## 🔧 Tecnologías y Patrones Utilizados

### Angular 20 Features
- **Standalone Components**: Arquitectura sin módulos NgModule
- **Signals**: Estado reactivo moderno
- **SSR con Hydration**: Renderizado en servidor con hidratación incremental
- **NgOptimizedImage**: Optimización automática de imágenes
- **Inject Function**: Inyección de dependencias funcional

### Patrones de Diseño
- **Repository Pattern**: Servicio StarWarsApiService para acceso a datos
- **State Management**: CartService con Signals para gestión de estado
- **Observer Pattern**: RxJS para operaciones asíncronas
- **Component Communication**: Input/Output properties y servicios

### Testing Strategy
- **Unit Testing**: Jest para tests unitarios
- **E2E Testing**: Cypress para tests de extremo a extremo
- **Component Testing**: Angular Testing Utilities

## 📡 Integración con APIs

### Star Wars API (SWAPI)
```typescript
// Endpoints utilizados
GET /api/vehicles/          // Lista de vehículos
GET /api/starships/         // Lista de naves espaciales  
GET /api/vehicles/:id/      // Detalle de vehículo
GET /api/starships/:id/     // Detalle de nave espacial
GET /api/films/:id/         // Información de películas
```

### Manejo de Datos
- Transformación de datos de API a modelos internos
- Caching en memoria para mejorar performance
- Error handling y estados de loading
- Fallbacks para datos faltantes

## 🎨 Sistema de Diseño

### Paleta de Colores
```scss
// Colores principales
--primary-color: #f39c12;      // Dorado/Naranja
--primary-dark: #e67e22;       // Naranja oscuro
--secondary-color: #3498db;    // Azul
--accent-color: #e74c3c;       // Rojo

// Fondos
--bg-primary: #0c0c0c;         // Negro profundo
--bg-secondary: #1a1a1a;       // Gris muy oscuro
--bg-tertiary: #2c3e50;        // Azul grisáceo
--bg-card: #34495e;            // Azul grisáceo claro
```

### Tipografía
- **Font Family**: Inter, system fonts
- **Headings**: Gradientes dorado-rojo para títulos principales
- **Body**: Color gris claro (#bdc3c7) para legibilidad

### Componentes UI
- Cards con gradientes y sombras
- Botones con estados hover y loading
- Inputs con focus states accesibles
- Loading spinners animados

## 🔒 Seguridad y Accesibilidad

### Seguridad
- Sanitización de datos de entrada
- Validación de parámetros de rutas
- Error boundaries para manejo de errores
- CSP headers (configurado en server)

### Accesibilidad (WCAG 2.1)
- Navegación por teclado completa
- Estados de focus visibles
- Etiquetas ARIA apropiadas
- Contraste de colores AA compliant
- Semantic HTML

## 📊 Performance

### Optimizaciones Implementadas
- **Lazy Loading**: Carga diferida de rutas
- **OnPush Change Detection**: En componentes donde aplicable
- **TrackBy Functions**: Para listas de elementos
- **NgOptimizedImage**: Optimización de imágenes
- **Tree Shaking**: Eliminación de código no utilizado

### Métricas Objetivo
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- Cumulative Layout Shift (CLS): < 0.1

## 🧪 Testing

### Tests Unitarios
```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

### Tests E2E
```bash
# Abrir Cypress UI
npm run e2e:open

# Ejecutar tests en headless
npm run e2e
```

### Estructura de Tests
- **Services**: Tests de lógica de negocio
- **Components**: Tests de renderizado y interacción
- **E2E**: Tests de flujos completos de usuario

## 🚀 Deployment

### GitHub Actions CI/CD
El proyecto incluye pipeline automatizado que:

1. **Testing Phase**
   - Ejecuta tests unitarios
   - Genera reportes de coverage
   - Ejecuta tests E2E

2. **Security Phase**
   - Auditoría de dependencias
   - Verificación de vulnerabilidades

3. **Build Phase**
   - Build para producción
   - Optimización de assets

4. **Deploy Phase**
   - Deploy a GitHub Pages
   - Notificaciones de estado

### Build para Producción
```bash
npm run build:prod
```

Genera archivos optimizados en `/dist` con:
- Minificación de código
- Tree shaking
- Lazy loading chunks
- Service Worker (si está habilitado)

## 🔄 Workflow de Desarrollo

### Git Flow
```bash
# Feature branch
git checkout -b feature/nueva-funcionalidad
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Pull Request -> main
```

### Commit Convention
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs  
- `docs:` - Documentación
- `style:` - Cambios de formato
- `refactor:` - Refactoring
- `test:` - Agregar tests
- `chore:` - Tareas de mantenimiento

## 📋 Checklist de Desarrollo

### Antes de hacer Push
- [ ] Tests unitarios pasando
- [ ] Tests E2E pasando  
- [ ] Build de producción exitoso
- [ ] Accesibilidad verificada
- [ ] Performance checkeada
- [ ] Documentación actualizada

### Antes de Release
- [ ] Version bump en package.json
- [ ] Changelog actualizado
- [ ] Tags de git creados
- [ ] Deploy a staging exitoso
- [ ] Tests de smoke pasando

## 🤝 Contribución

### Setup del Entorno
1. Fork del repositorio
2. Clone local
3. `npm install`
4. `npm start`
5. Crear feature branch
6. Hacer cambios
7. Tests pasando
8. Push y PR

### Code Review Checklist
- [ ] Código sigue convenciones del proyecto
- [ ] Tests incluidos para nueva funcionalidad
- [ ] Documentación actualizada
- [ ] Performance no afectada negativamente
- [ ] Accesibilidad mantenida

---

Para más información, ver la documentación en `/docs` o contactar al equipo de desarrollo.