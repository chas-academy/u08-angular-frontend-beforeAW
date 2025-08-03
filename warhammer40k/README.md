
# Warhammer 40k Angular Frontend

## Description
This is a modern Angular 19 application for managing Warhammer 40k data, including factions, subfactions, figures, units, weapons, weapon profiles, abilities, and keywords. The app uses Tailwind CSS for styling and provides full CRUD functionality via modal forms.

## Installation
1. Clone the project:
   ```bash
   git clone <repo-url>
   cd warhammer40k
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the app in your browser at `http://localhost:4200`

## Features
- CRUD for all Warhammer 40k entities
- Modal-based forms for adding and editing
- Dropdowns for related entities
- Navigation via Angular Router
- Tailwind CSS for responsive and modern design

## Getting Started as a New Developer
To quickly get familiar with the project:

1. **Start with `src/app/pages/`**
   - Each page corresponds to an entity (e.g., `factions.page.ts`, `weapons.page.ts`).
   - Pages use components from `src/app/components/`.

2. **Check the components in `src/app/components/`**
   - Here you'll find UI logic and modal forms (e.g., `weapons.component.ts`).

3. **API logic is in `src/app/services/`**
   - Each service handles CRUD operations against the backend API.

4. **Routing and configuration**
   - See `app.routes.ts` for page navigation.
   - See `app.config.ts` for Angular providers.

5. **Adding functionality**
   - Add new entities by creating a service, component, and page.
   - Follow the pattern used for existing entities.

## Tips
- Start by reading through a page and its component.
- Try adding or editing an entity via the UI to understand the flow.
- Use Angular CLI to generate new components and services.

## Contact
For questions, contact the project owner or create an issue in the GitHub repo.
