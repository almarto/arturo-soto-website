# Test Suite Documentation

Esta suite de tests proporciona cobertura completa para el sitio web de Arturo Soto SA, asegurando que los refactors y actualizaciones de dependencias se puedan realizar de forma segura.

## Estructura de Tests

### 1. Tests Unitarios (Vitest)

#### `build.test.ts`
Tests que verifican el proceso de build:
- ✓ El proyecto se compila correctamente
- ✓ Se genera el archivo `index.html`
- ✓ Los assets públicos se copian a `dist/`
- ✓ El HTML generado tiene estructura válida
- ✓ Se incluyen meta tags necesarios
- ✓ El HTML está minificado en producción

#### `content.test.ts`
Tests que verifican el contenido del HTML generado:
- **Header**: Imagen de portada
- **About**: Descripción de la empresa
- **Contact**: Dirección, teléfono y horario
- **Map**: Iframe de Google Maps
- **Subsidies**: Imagen de subvenciones
- **Footer**: Copyright
- **Styling**: Variables CSS y media queries
- **Accessibility**: Atributos `lang`, `alt`, jerarquía de headings
- **SEO**: Meta tags, título, favicon

### 2. Tests End-to-End (Playwright)

#### `homepage.spec.ts`
Tests que verifican el comportamiento en navegadores reales:
- **Renderizado**: Todos los elementos se muestran correctamente
- **Contenido**: Todo el texto e imágenes son visibles
- **Estructura**: HTML semántico correcto
- **Imágenes**: Se cargan exitosamente
- **Responsive**: Funciona en mobile (iPhone 12)
- **Performance**:
  - Carga en menos de 3 segundos
  - Sin errores de consola
  - Sin requests fallidos
- **Accessibility**: Lang, alt texts, landmarks

## Comandos Disponibles

### Tests Unitarios
```bash
# Ejecutar tests una vez
pnpm test

# Ejecutar tests en modo watch (desarrollo)
pnpm test:watch

# Ejecutar tests con reporte de cobertura
pnpm test:coverage
```

### Tests E2E
```bash
# Instalar navegadores de Playwright (primera vez)
pnpm playwright:install

# Ejecutar tests E2E
pnpm test:e2e

# Ejecutar tests E2E con UI interactiva
pnpm test:e2e:ui

# Ejecutar tests E2E en modo debug
pnpm test:e2e:debug
```

### Ejecutar Todos los Tests
```bash
pnpm test:all
```

## Configuración

### Vitest (`vitest.config.ts`)
- **Environment**: Node.js
- **Coverage**: V8 con reportes en text, HTML y LCOV
- **Glob pattern**: `tests/**/*.test.ts`

### Playwright (`playwright.config.ts`)
- **Navegadores**: Chrome Desktop y Mobile Safari (iPhone 12)
- **Base URL**: http://localhost:4321
- **Screenshots**: Solo en fallos
- **Traces**: En primer retry
- **Web Server**: Auto-inicia preview antes de tests

## CI/CD Integration

### GitHub Actions
```yaml
- name: Install dependencies
  run: pnpm ci

- name: Build
  run: pnpm build

- name: Run unit tests
  run: pnpm test

- name: Install Playwright
  run: pnpm playwright:install

- name: Run E2E tests
  run: pnpm test:e2e
```

### Netlify
Añade en `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "20"

[build]
  command = "pnpm build && pnpm test"
```

## Estrategia de Testing para Refactors

### 1. Antes de Actualizar Dependencias
```bash
# Ejecutar suite completa
pnpm test:all

# Verificar que todo pasa
# Si algo falla, arreglar antes de continuar
```

### 2. Durante la Actualización
```bash
# Actualizar dependencia
pnpm update astro

# Ejecutar tests inmediatamente
pnpm test:all

# Si fallan, identificar breaking changes
```

### 3. Después de la Actualización
```bash
# Verificar build
pnpm build

# Ejecutar tests con cobertura
pnpm test:coverage

# Ejecutar E2E en todos los navegadores
pnpm test:e2e
```

## Mantenimiento de Tests

### Cuando Agregar Nuevos Tests
- ✓ Al añadir nuevas secciones a la página
- ✓ Al añadir nuevos assets (imágenes, fuentes)
- ✓ Al cambiar estructura HTML significativa
- ✓ Al añadir interactividad (JavaScript)
- ✓ Al implementar nuevos estilos o temas

### Cuando Actualizar Tests Existentes
- ✓ Al cambiar contenido (textos, imágenes)
- ✓ Al modificar IDs o clases CSS
- ✓ Al cambiar estructura de secciones
- ✓ Al actualizar información de contacto

## Troubleshooting

### Tests Unitarios Fallan
```bash
# Ver output detallado
pnpm test -- --reporter=verbose

# Ejecutar un solo archivo
pnpm test -- build.test.ts
```

### Tests E2E Fallan
```bash
# Ver UI interactiva
pnpm test:e2e:ui

# Ver screenshots de fallos
ls -la test-results/

# Ver traces
npx playwright show-trace test-results/.../trace.zip
```

### Build Falla en Tests
```bash
# Limpiar dist y rebuilder
rm -rf dist .astro
pnpm build
pnpm test
```

## Cobertura de Tests

La suite de tests cubre:
- ✅ Build process
- ✅ HTML generation
- ✅ Asset copying
- ✅ Content integrity
- ✅ Semantic HTML
- ✅ SEO basics
- ✅ Accessibility
- ✅ Responsive design
- ✅ Performance
- ✅ Browser compatibility

## Próximos Pasos

Considera añadir:
- [ ] Tests de accesibilidad con axe-core
- [ ] Tests de performance con Lighthouse
- [ ] Tests visuales con Percy o Chromatic
- [ ] Tests de carga con Artillery
- [ ] Integration tests con API externa (si se añade)
