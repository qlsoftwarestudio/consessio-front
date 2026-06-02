# Plan: Suite E2E Playwright + POM para Consessio CRM

Crear una suite de pruebas end-to-end con Playwright y Page Object Model (POM) en el repo del frontend, cubriendo **todos los endpoints expuestos** (~60+) de la API, validando flujos completos por rol de usuario.

---

## 1. Inventario completo de la API

### Auth (`/auth/**` — público)
| # | Método | Endpoint | Body | Descripción |
|---|--------|----------|------|-------------|
| 1 | POST | `/auth/onboarding` | `OnboardingRequest` | Crear tenant + admin GERENTE |
| 2 | POST | `/auth/register` | `UserRequestDTO` | Registrar usuario (requiere Bearer) |
| 3 | POST | `/auth/login` | `AuthRequest` | Login, retorna JWT |

### Users (`/users/**` — todos leen, GERENTE/SUPERVISOR escriben)
| # | Método | Endpoint | Auth | Rol |
|---|--------|----------|------|-----|
| 4 | GET | `/users` | Bearer | Todos |
| 5 | GET | `/users/{id}` | Bearer | Todos |
| 6 | GET | `/users/me` | Bearer | Todos |
| 7 | POST | `/users` | Bearer | GERENTE/SUPERVISOR/ADMIN |
| 8 | DELETE | `/users/{id}` | Bearer | GERENTE/SUPERVISOR/ADMIN (soft delete) |

### Leads (`/api/leads/**` — todos los roles)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 9 | GET | `/api/leads` | Bearer | Listar leads paginados |
| 10 | GET | `/api/leads/status/{status}` | Bearer | Filtrar por estado |
| 11 | GET | `/api/leads/my-leads` | Bearer | Leads asignados al usuario |
| 12 | GET | `/api/leads/unassigned` | Bearer | Leads sin asignar |
| 13 | GET | `/api/leads/search?query=` | Bearer | Búsqueda por nombre/email/teléfono |
| 14 | GET | `/api/leads/{id}` | Bearer | Detalle de lead |
| 15 | POST | `/api/leads` | Bearer | Crear lead |
| 16 | PUT | `/api/leads/{id}` | Bearer | Editar lead |
| 17 | DELETE | `/api/leads/{id}` | Bearer | Eliminar lead |
| 18 | PUT | `/api/leads/{id}/status` | Bearer | Cambiar estado del lead |
| 19 | PUT | `/api/leads/{id}/assign/{userId}` | Bearer | Asignar lead a usuario |
| 20 | GET | `/api/leads/stats/by-status` | Bearer | Estadísticas por estado |

### Vehicles (`/api/vehicles/**` — GERENTE/SUPERVISOR escriben, todos leen)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 21 | GET | `/api/vehicles` | Bearer | Listar vehículos |
| 22 | GET | `/api/vehicles/available` | Bearer | Vehículos disponibles |
| 23 | GET | `/api/vehicles/{id}` | Bearer | Detalle de vehículo |
| 24 | GET | `/api/vehicles/vin/{vin}` | Bearer | Buscar por VIN |
| 25 | GET | `/api/vehicles/search?model=` | Bearer | Buscar por modelo |
| 26 | POST | `/api/vehicles` | Bearer GERENTE/SUPERVISOR | Crear vehículo |
| 27 | PUT | `/api/vehicles/{id}` | Bearer GERENTE/SUPERVISOR | Editar vehículo |
| 28 | DELETE | `/api/vehicles/{id}` | Bearer GERENTE/SUPERVISOR | Eliminar vehículo |
| 29 | PUT | `/api/vehicles/{id}/status` | Bearer GERENTE/SUPERVISOR | Cambiar estado |
| 30 | PUT | `/api/vehicles/{id}/reserve` | Bearer GERENTE/SUPERVISOR | Reservar |
| 31 | PUT | `/api/vehicles/{id}/sell` | Bearer GERENTE/SUPERVISOR | Marcar vendido |
| 32 | PUT | `/api/vehicles/{id}/release` | Bearer GERENTE/SUPERVISOR | Liberar reserva |
| 33 | GET | `/api/vehicles/{id}/availability` | Bearer | Verificar disponibilidad |

### Quotations (`/api/quotations/**` — todos los roles)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 34 | GET | `/api/quotations` | Bearer | Listar cotizaciones |
| 35 | GET | `/api/quotations/lead/{leadId}` | Bearer | Cotizaciones de un lead |
| 36 | GET | `/api/quotations/type/{type}` | Bearer | Filtrar por tipo (CONTADO/FINANCIADO/PLAN_FIAT) |
| 37 | GET | `/api/quotations/{id}` | Bearer | Detalle de cotización |
| 38 | POST | `/api/quotations` | Bearer | Crear cotización |
| 39 | PUT | `/api/quotations/{id}` | Bearer | Editar cotización |
| 40 | POST | `/api/quotations/{id}/send` | Bearer | Marcar como enviada |
| 41 | DELETE | `/api/quotations/{id}` | Bearer | Eliminar cotización |
| 42 | GET | `/api/quotations/stats/by-type` | Bearer | Estadísticas por tipo |
| 43 | GET | `/api/quotations/valid` | Bearer | Cotizaciones vigentes |

### Test Drives (`/api/test-drives/**` — todos los roles)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 44 | GET | `/api/test-drives` | Bearer | Listar test drives |
| 45 | GET | `/api/test-drives/lead/{leadId}` | Bearer | Test drives de un lead |
| 46 | GET | `/api/test-drives/status/{status}` | Bearer | Filtrar por estado |
| 47 | GET | `/api/test-drives/calendar?start=&end=` | Bearer | Vista calendario |
| 48 | GET | `/api/test-drives/today` | Bearer | Test drives de hoy |
| 49 | GET | `/api/test-drives/my-test-drives` | Bearer | Mis test drives (vendedor) |
| 50 | GET | `/api/test-drives/{id}` | Bearer | Detalle de test drive |
| 51 | POST | `/api/test-drives` | Bearer | Agendar test drive |
| 52 | PUT | `/api/test-drives/{id}` | Bearer | Editar test drive (solo AGENDADO) |
| 53 | PUT | `/api/test-drives/{id}/confirm` | Bearer | Confirmar |
| 54 | PUT | `/api/test-drives/{id}/complete` | Bearer | Completar (con kmAfter + notes) |
| 55 | PUT | `/api/test-drives/{id}/cancel` | Bearer | Cancelar (con reason opcional) |
| 56 | PUT | `/api/test-drives/{id}/no-show` | Bearer | Marcar como no-show |
| 57 | DELETE | `/api/test-drives/{id}` | Bearer | Eliminar |

### Activities (`/api/activities/**` — todos los roles)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 54 | GET | `/api/activities/lead/{leadId}` | Bearer | Actividades de un lead |
| 55 | GET | `/api/activities/lead/{leadId}/timeline` | Bearer | Timeline ordenado |
| 56 | GET | `/api/activities/type/{type}` | Bearer | Filtrar por tipo |
| 57 | GET | `/api/activities/my-activities` | Bearer | Mis actividades |
| 58 | GET | `/api/activities/stats?start=&end=` | Bearer | Estadísticas por tipo |
| 59 | POST | `/api/activities` | Bearer | Crear actividad |

### Documents (`/api/documents/**` — todos los roles)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 60 | GET | `/api/documents/lead/{leadId}` | Bearer | Documentos de un lead |
| 61 | GET | `/api/documents/lead/{leadId}/type/{type}` | Bearer | Documentos por tipo |
| 62 | GET | `/api/documents/lead/{leadId}/verified` | Bearer | Documentos verificados |
| 63 | GET | `/api/documents/lead/{leadId}/checklist` | Bearer | Checklist de tipos verificados |
| 64 | GET | `/api/documents/lead/{leadId}/stats` | Bearer | Estadísticas de documentos |
| 65 | POST | `/api/documents` (multipart) | Bearer | Subir documento |
| 66 | GET | `/api/documents/{id}/download` | Bearer | Descargar documento |
| 67 | PUT | `/api/documents/{id}/verify` | Bearer | Verificar documento |
| 68 | DELETE | `/api/documents/{id}` | Bearer | Eliminar documento |

### Excel (`/api/excel/**` — GERENTE/SUPERVISOR)
| # | Método | Endpoint | Auth | Descripción |
|---|--------|----------|------|-------------|
| 69 | GET | `/api/excel/uploads` | Bearer GERENTE/SUPERVISOR | Listar uploads |
| 70 | GET | `/api/excel/uploads/status/{status}` | Bearer GERENTE/SUPERVISOR | Filtrar por estado |
| 71 | GET | `/api/excel/uploads/{id}` | Bearer GERENTE/SUPERVISOR | Detalle de upload |
| 72 | POST | `/api/excel/uploads` | Bearer GERENTE/SUPERVISOR | Registrar upload |
| 73 | PUT | `/api/excel/uploads/{id}/process` | Bearer GERENTE/SUPERVISOR | Marcar procesando |
| 74 | PUT | `/api/excel/uploads/{id}/complete` | Bearer GERENTE/SUPERVISOR | Marcar completado |
| 75 | PUT | `/api/excel/uploads/{id}/error` | Bearer GERENTE/SUPERVISOR | Marcar error |
| 76 | GET | `/api/excel/template` | Bearer GERENTE/SUPERVISOR | Descargar template |
| 77 | POST | `/api/excel/upload` (multipart) | Bearer GERENTE/SUPERVISOR | Subir y procesar Excel |

**Total: ~80 endpoints.**

---

## 2. Matriz de roles vs permisos

| Endpoint | GERENTE | SUPERVISOR | VENDEDORA | PLANES |
|----------|:-------:|:----------:|:---------:|:------:|
| `/auth/onboarding` | ✅ | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | ✅ | ✅ | ✅ |
| `/auth/register` | ✅ | ✅ | ❌ | ❌ |
| `/users` (GET) | ✅ | ✅ | ✅ | ✅ |
| `/users` (POST/DELETE) | ✅ | ✅ | ❌ | ❌ |
| `/api/leads/**` | ✅ | ✅ | ✅ | ✅ |
| `/api/vehicles` (GET) | ✅ | ✅ | ✅ | ✅ |
| `/api/vehicles` (POST/PUT/DELETE) | ✅ | ✅ | ❌ | ❌ |
| `/api/quotations/**` | ✅ | ✅ | ✅ | ✅ |
| `/api/test-drives/**` | ✅ | ✅ | ✅ | ✅ |
| `/api/activities/**` | ✅ | ✅ | ✅ | ✅ |
| `/api/documents/**` | ✅ | ✅ | ✅ | ✅ |
| `/api/excel/**` | ✅ | ✅ | ❌ | ❌ |

---

## 3. Estructura de Page Objects (POM)

```
e2e/
├── playwright.config.ts
├── fixtures/
│   └── test-data.ts           # Datos de prueba, factories
├── pages/
│   ├── BasePage.ts            # Navegación, helpers comunes
│   ├── LoginPage.ts           # Login + onboarding
│   ├── DashboardPage.ts       # Home / dashboard
│   ├── LeadsPage.ts           # CRUD leads, asignación, estados
│   ├── VehiclesPage.ts        # CRUD vehículos, reserva/venta
│   ├── QuotationsPage.ts      # CRUD cotizaciones, envío
│   ├── TestDrivesPage.ts      # CRUD test drives, confirmar/completar/cancelar
│   ├── ActivitiesPage.ts      # CRUD actividades, timeline
│   ├── DocumentsPage.ts       # Subida, descarga, verificación
│   ├── UsersPage.ts           # Listar, crear, soft-delete usuarios
│   └── ExcelPage.ts           # Upload de Excel, descarga template
├── components/
│   ├── ToastComponent.ts      # Toasts/notificaciones
│   ├── ModalComponent.ts      # Modales genéricos
│   ├── SidebarComponent.ts    # Navegación lateral
│   └── TableComponent.ts      # Tablas paginadas, filtros
├── api/
│   └── ApiClient.ts           # Wrapper de fetch para la API REST (para setup/teardown)
├── tests/
│   ├── 00-setup/
│   │   └── onboarding.spec.ts     # Onboarding + creación de tenant de prueba
│   ├── 01-auth/
│   │   ├── login.spec.ts          # Login con cada rol
│   │   └── register.spec.ts       # Registro de usuarios por rol
│   ├── 02-leads/
│   │   ├── crud.spec.ts           # Crear, leer, editar, eliminar lead
│   │   ├── assign.spec.ts         # Asignación de leads
│   │   ├── status-flow.spec.ts    # Flujo de estados (NUEVO → CONTACTADO → ...)
│   │   └── search.spec.ts         # Búsqueda y filtros
│   ├── 03-vehicles/
│   │   ├── crud.spec.ts           # CRUD vehículos
│   │   ├── reservation.spec.ts    # Reservar, vender, liberar
│   │   └── permissions.spec.ts    # 403 para VENDEDORA creando vehículo
│   ├── 04-quotations/
│   │   ├── crud.spec.ts
│   │   ├── send.spec.ts
│   │   └── stats.spec.ts
│   ├── 05-test-drives/
│   │   ├── crud.spec.ts           # Crear, editar, listar, detalle
│   │   ├── lifecycle.spec.ts      # Agendado → Confirmado → Completado
│   │   ├── my-test-drives.spec.ts # GET /my-test-drives por vendedor
│   │   ├── today.spec.ts          # GET /today (vista diaria)
│   │   ├── cancel.spec.ts         # Cancelar con motivo
│   │   ├── no-show.spec.ts        # Marcar no-show
│   │   └── vehicle-reservation.spec.ts  # Vehículo DISPONIBLE → EN_TEST_DRIVE → DISPONIBLE
│   ├── 06-activities/
│   │   ├── crud.spec.ts
│   │   └── timeline.spec.ts
│   ├── 07-documents/
│   │   ├── upload.spec.ts
│   │   ├── download.spec.ts
│   │   └── verify.spec.ts
│   ├── 08-users/
│   │   ├── list.spec.ts
│   │   ├── soft-delete.spec.ts    # Delete + verificar que no aparece + login bloqueado
│   │   └── me.spec.ts             # GET /users/me para cada rol
│   ├── 09-excel/
│   │   ├── template.spec.ts
│   │   └── upload.spec.ts
│   └── 10-rbac/
│       └── permissions.spec.ts    # Suite de 403 por rol
└── utils/
    ├── auth.ts                    # Login helper, JWT storage
    ├── tenants.ts                 # Crear tenant único por test run
    └── expect-helpers.ts          # Matchers custom (toast visible, tabla cargó, etc.)
```

---

## 4. Flujos E2E principales por rol

### Flujo GERENTE (admin completo)
1. Onboarding → login → `/users/me` valida rol GERENTE
2. Crear 3 usuarios: VENDEDORA, SUPERVISOR, PLANES
3. Crear lead → asignar a VENDEDORA
4. Crear vehículo → reservar → liberar → vender
5. Crear cotización para el lead → marcar como enviada
6. Agendar test drive → confirmar → completar
7. Crear actividad (LLAMADA) en el lead
8. Subir documento al lead → verificar
9. Descargar template Excel → subir Excel con leads
10. Soft-delete del usuario temporal → verificar 401 en login
11. Revisar stats: leads por estado, cotizaciones por tipo

### Flujo VENDEDORA (operativa de ventas)
1. Login → `/users/me` valida rol VENDEDORA
2. Crear lead (propio) → listar `/api/leads/my-leads`
3. Intentar crear vehículo → esperar 403
4. Crear cotización para su lead
5. Agendar test drive (con durationMinutes, kmBefore, clientLicenseNumber/Type/Expiry)
5b. Verificar `/api/test-drives/my-test-drives`
5c. Editar test drive (solo si está AGENDADO)
5d. Cancelar test drive con motivo → verificar lead vuelve a CONTACTADO
5e. Crear test drive adicional → marcar no-show → verificar lead vuelve a CONTACTADO
6. Crear actividad sobre el lead
7. Subir documento al lead
8. No puede acceder a `/api/excel/template` → esperar 403

### Flujo SUPERVISOR (supervisión)
1. Login → ver listado completo de leads
2. Reasignar lead de VENDEDORA A a VENDEDORA B
3. Ver stats de actividades
4. Puede crear vehículos y subir Excel

### Flujo PLANES (financiación)
1. Login → crear cotización FINANCIADA
2. Ver cotizaciones por tipo
3. No puede crear vehículos ni subir Excel

---

## 5. Configuración de Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,        // Tests secuenciales (mismo tenant)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,                  // 1 worker para no pisar datos
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

**Variables de entorno necesarias:**
```bash
FRONTEND_URL=https://consessio-front.vercel.app
# o para local:
FRONTEND_URL=http://localhost:8081
```

---

## 6. Estrategia de datos de prueba

Cada ejecución de la suite debe:
1. Generar un `businessName` único (ej: `E2E Test 123456`)
2. Hacer onboarding → obtener `tenantCode` + `adminToken`
3. Usar ese tenant como sandbox para **toda** la suite
4. Al finalizar, eliminar el tenant (o dejarlo para debugging)

**Factories de datos (TypeScript):**
```typescript
// fixtures/test-data.ts
export const leadFactory = (overrides?: Partial<Lead>) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  source: 'WEB',
  ...overrides,
});

export const vehicleFactory = (overrides?: Partial<Vehicle>) => ({
  vin: `VIN${Date.now()}`,
  model: faker.vehicle.model(),
  year: 2024,
  priceList: 25000000,
  ...overrides,
});
```

---

## 7. API Client para setup/teardown

Además de los tests de UI, se necesita un `ApiClient` para:
- Onboarding inicial (más rápido que hacerlo por UI)
- Cleanup de datos de prueba
- Verificaciones directas a la API (assertions de backend)

```typescript
// api/ApiClient.ts
class ApiClient {
  async onboarding(req: OnboardingRequest): Promise<{ token: string; tenantCode: string }>;
  async login(tenantCode: string, email: string, password: string): Promise<string>; // token
  async register(token: string, user: UserRequestDTO): Promise<{ token: string; id: number }>;
  async deleteUser(token: string, id: number): Promise<void>;
  // ... wrappers para todos los endpoints
}
```

---

## 8. Roadmap de implementación

| Fase | Tests | Esfuerzo estimado |
|------|-------|-------------------|
| **Fase 1: Setup + Auth** | Onboarding, login, register, `/users/me` | 2-3 horas |
| **Fase 2: Leads (core)** | CRUD leads, asignación, búsqueda, estados | 3-4 horas |
| **Fase 3: Vehículos + Cotizaciones** | CRUD + permisos 403 | 2-3 horas |
| **Fase 4: Test Drives + Actividades** | Flujos completos (incl. today, my-test-drives, no-show, vehicle reservation) | 3-4 horas |
| **Fase 5: Documentos** | Upload, download, verify | 2 horas |
| **Fase 6: Usuarios + Excel** | Soft delete, stats, upload Excel | 2 horas |
| **Fase 7: RBAC completo** | Suite de permisos por rol | 2 horas |
| **Fase 8: CI/CD** | GitHub Actions, reportes HTML | 1-2 horas |

**Total estimado: ~18-24 horas de trabajo**

---

## 9. CI/CD (GitHub Actions)

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        with: { name: playwright-report, path: playwright-report/ }
```

---

## 10. Criterios de aceptación

- [ ] Todos los tests pasan contra `https://consessio-front.vercel.app`
- [ ] La suite puede ejecutarse también en `localhost:8081`
- [ ] Cada test es independiente (setup/teardown propio)
- [ ] Los tests de permisos (403) cubren todos los endpoints restringidos
- [ ] Reporte HTML generado con capturas de pantalla en fallos
- [ ] Tiempo total de ejecución < 5 minutos

---

## 11. Próximo paso tras esta suite

Una vez que la suite E2E esté verde y estable, integrar **ql-agent** como copiloto IA dentro del flujo de trabajo de los vendedores (sugerencias automáticas de follow-up, análisis de sentimiento en actividades, etc.).