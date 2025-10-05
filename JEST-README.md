# Jest Testing Setup - Angular 20 Project

## 📋 Estado Actual

✅ **Jest configurado y funcionando** para tests de lógica pura de TypeScript  
❌ **Tests de Angular** (ComponentFixture, TestBed) no compatibles por problemas con ESM modules  
✅ **Scripts de npm configurados** y listos para usar  

## 🚀 Scripts Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## 📁 Tipos de Tests Compatibles

### ✅ Funcionan perfecto con Jest:
- **Tests de lógica pura** - funciones utilitarias, algoritmos, validaciones
- **Tests de servicios** - lógica de negocio sin dependencias de Angular
- **Tests de modelos** - interfaces, clases, transformaciones de datos
- **Tests unitarios** - funciones aisladas sin framework

### ❌ No funcionan (por ahora):
- Tests de **componentes Angular** que usan `ComponentFixture`
- Tests que usan **TestBed** de Angular
- Tests que importan `@angular/core/testing`

## 📝 Convenciones de Nomenclatura

Para que Jest ejecute tus tests, usa estos patrones de nombres:

```
✅ basic.spec.ts          - Tests básicos
✅ *-pure.spec.ts         - Tests de lógica pura  
✅ *-logic.spec.ts        - Tests de lógica de negocio
✅ cart-pure-logic.spec.ts - Ejemplo actual
```

## 🔧 Estructura de Tests

### Ejemplo de test de lógica pura:
```typescript
// utils-pure.spec.ts
describe('Price Utilities', () => {
  function formatPrice(price: string | number): string {
    const numPrice = typeof price === 'string' ? parseInt(price, 10) : price;
    if (isNaN(numPrice)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numPrice);
  }

  it('should format numeric prices correctly', () => {
    expect(formatPrice(149999)).toBe('$149,999.00');
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle invalid prices', () => {
    expect(formatPrice('unknown')).toBe('N/A');
  });
});
```

## 📊 Coverage Reports

Los reportes de cobertura se generan en:
- **HTML**: `coverage/lcov-report/index.html` (abre en navegador)
- **Terminal**: Resumen en la consola
- **LCOV**: `coverage/lcov.info` (para CI/CD)

## 🛠️ Configuración Actual

### jest.config.js
- **Preset**: `ts-jest` para soporte TypeScript
- **Environment**: `jsdom` para APIs del navegador
- **Setup**: `setup-jest.ts` con mocks globales
- **Coverage**: HTML, text-summary y lcov reports

### Archivos Importantes
- `jest.config.js` - Configuración principal de Jest
- `setup-jest.ts` - Setup con mocks globales
- `tsconfig.spec.json` - Configuración TypeScript para tests

## 🔮 Futuro - Tests de Angular

Para tests de componentes Angular, recomendamos:

1. **Karma + Jasmine** (estándar Angular) - mejor compatibilidad
2. **Esperar** actualizaciones de `jest-preset-angular` para Angular 20
3. **Web Test Runner** - alternativa moderna

## 📚 Ejemplos de Tests Útiles

```typescript
// Validation utilities
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Array operations  
function groupVehiclesByType(vehicles: Vehicle[]): Record<string, Vehicle[]> {
  return vehicles.reduce((groups, vehicle) => {
    const type = vehicle.type || 'unknown';
    groups[type] = groups[type] || [];
    groups[type].push(vehicle);
    return groups;
  }, {} as Record<string, Vehicle[]>);
}

// Price calculations
function calculateDiscount(original: number, percentage: number): number {
  return original * (percentage / 100);
}
```

## 🐛 Troubleshooting

### "Cannot use import statement outside a module"
- Este error ocurre con módulos Angular ESM
- Solución: Mantener tests de lógica pura sin imports de Angular

### "Module not found"
- Verificar rutas de imports
- Usar paths configurados en `moduleNameMapper`

### Tests no se ejecutan
- Verificar que el nombre sigue las convenciones
- Comprobar que está en la carpeta `src/`

---

¡Jest está listo para tests de lógica pura y utilitarios! 🚀
