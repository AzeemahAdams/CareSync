# CareSync

**Healthcare access, navigation and referral coordination platform.**

CareSync helps patients find appropriate healthcare facilities, navigate referrals between providers, and access emergency healthcare information. It connects patients, healthcare facilities, and administrators through a unified digital interface.

> CareSync is an information and navigation tool. It does not provide medical advice, diagnosis, or emergency dispatch.

---

## Live preview

Serve the project from any static HTTP server:

```bash
# Node (no install required)
npx serve . --listen 5500

# Python 3
python -m http.server 5500
```

Then open **http://localhost:5500**

### Test accounts

| Role     | Email                      | Password     |
|----------|---------------------------|--------------|
| Patient  | patient@CareSync.ng      | CareSync1!  |
| Facility | facility@CareSync.ng     | CareSync1!  |
| Admin    | admin@CareSync.ng        | CareSync1!  |

---

## Project structure

```
CareSync/
├── index.html               # Public landing page
├── find-care.html           # Public facility search (no login required)
├── about.html
├── how-it-works.html
├── contact.html
├── offline.html             # PWA offline fallback
├── manifest.json            # PWA manifest
├── service-worker.js        # PWA service worker
│
├── auth/
│   ├── login.html
│   └── register.html
│
├── patient/
│   ├── dashboard.html
│   ├── find-care.html       # Authenticated facility search with full details
│   ├── facility-details.html
│   ├── smart-matching.html
│   ├── emergency.html
│   ├── referrals.html
│   └── profile.html
│
├── facility/
│   ├── dashboard.html
│   ├── profile.html
│   ├── services.html
│   └── referrals.html
│
├── admin/
│   ├── dashboard.html       # Chart.js charts
│   ├── users.html
│   ├── facilities.html
│   ├── verification.html
│   ├── referrals.html
│   └── reports.html
│
├── css/
│   ├── variables.css        # Design tokens (colours, spacing, typography)
│   ├── reset.css
│   ├── global.css
│   ├── components.css       # Buttons, cards, badges, modals, toasts
│   ├── landing.css          # Public pages + hero map
│   ├── auth.css             # Login / registration
│   ├── patient.css          # Dashboard app shell + patient UI
│   ├── facility.css         # Facility-specific overrides
│   ├── admin.css            # Admin tables, charts, verification
│   └── responsive.css       # Breakpoint overrides
│
└── js/
    ├── main.js              # Shared DOMContentLoaded entry point
    ├── config/
    │   ├── api-config.js    # BASE_URL, USE_MOCK, ENDPOINTS
    │   └── translations.js  # i18n strings (en, yo)
    ├── components/
    │   ├── layout.js        # Header / footer injection
    │   ├── navigation.js    # Mobile nav, active state
    │   ├── app-shell.js     # Dashboard sidebar, topbar, logout
    │   ├── modal.js
    │   ├── toast.js
    │   ├── form-validation.js
    │   ├── icons.js         # Inline SVG icon system
    │   └── language-switcher.js
    ├── services/
    │   ├── api-service.js   # Base fetch wrapper with token injection
    │   ├── auth-service.js  # Login, register, logout, requireAuth()
    │   ├── mock-data.js     # Placeholder data (active when USE_MOCK=true)
    │   ├── facility-service.js  # Search, matching algorithm, CRUD
    │   ├── referral-service.js
    │   └── admin-service.js
    └── pages/
        ├── landing.js       # Hero map + search form
        ├── auth.js          # Login / register interactions
        └── contact.js       # Contact form submission
```

---

## Technology stack

| Layer | Choice |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, no framework) |
| Scripts | Vanilla JavaScript ES6+ |
| Maps | Leaflet.js + OpenStreetMap |
| Charts | Chart.js (admin dashboard only) |
| Fonts | Google Fonts — Manrope + DM Sans |
| Icons | Inline SVG (Lucide-style, no network dependency) |

No React, Vue, Angular, TypeScript, jQuery, Tailwind, or Bootstrap.

---

## Backend integration

The frontend is fully decoupled from the backend. To connect a real API:

1. Open `js/config/api-config.js`
2. Set `BASE_URL` to your API server
3. Set `USE_MOCK: false`

All service modules (`auth-service.js`, `facility-service.js`, etc.) will automatically switch from local placeholder data to live API calls. Each file contains labelled integration points.

### Proposed API contract

```
POST   /auth/login
POST   /auth/register
POST   /auth/logout
GET    /auth/me

GET    /facilities
GET    /facilities/search?q=&service=&type=&sort=
GET    /facilities/:id
GET    /facilities/:id/services

GET    /referrals
GET    /referrals/:id
PATCH  /referrals/:id/status

GET    /users
GET    /users/:id

GET    /admin/dashboard
GET    /admin/facilities
POST   /admin/facilities/:id/verify
GET    /admin/users
GET    /admin/reports

POST   /contact
```

---

## Features

### Public
- Landing page with interactive Leaflet map preview
- Public facility search (location, service, type filters; list + map view)
- About, How It Works, Contact pages
- English / Yorùbá language switcher

### Patient dashboard
- Facility discovery with real-time search and filters
- Interactive map view of results
- Smart facility matching with 5-factor transparent scoring
- Facility detail pages with mini map
- Emergency facility finder with 24-hour contact list
- Referral history with status tracking
- Profile management

### Facility dashboard
- Profile editing (name, type, address, hours, accessibility)
- Service management (add, view, remove)
- Incoming referral management (accept, decline, mark in progress, complete)

### Admin dashboard
- Platform overview with Chart.js charts (doughnut, bar, line)
- User management with role and status filters
- Facility management with status filter
- Facility verification queue (approve/reject with notes)
- Referral oversight table
- Reports with summary statistics and charts

---

## Accessibility

- Semantic HTML with proper heading hierarchy
- Keyboard navigable throughout
- Visible focus indicators
- ARIA labels on all interactive elements
- No colour-only status indicators — all statuses include text
- Responsive from 320px to 1440px+
- Skip-to-content link on every public page

---

## PWA support

- `manifest.json` for installability
- `service-worker.js` caches static shell assets
- `offline.html` shown when network is unavailable
- API responses are never cached (no sensitive data at rest)

---

## Roadmap

- [ ] Backend API integration
- [ ] Real authentication with JWT
- [ ] Hausa (ha) and Igbo (ig) language support
- [ ] Push notifications for referral status updates
- [ ] Facility map search with geolocation
- [ ] Accessibility audit with screen reader testing
- [ ] Production deployment (Vercel / Netlify / AWS)

---

## Disclaimer

CareSync is a healthcare navigation tool. It does not:
- Provide medical advice or diagnosis
- Dispatch ambulances or emergency services
- Guarantee facility availability or appointment slots
- Replace consultation with qualified healthcare professionals

In an emergency, call **112** (Nigeria national) or **767** (Lagos State).
