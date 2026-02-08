# Event Reporting App

## Description
A web application for reporting and managing safety incidents. The system includes a structured form for submitting events and a dashboard for filtering and updating their status. The interface supports Hebrew (RTL), dark mode, and is responsive across devices.

Built with React, TypeScript, Vite, and uses `react-hook-form` with `zod` for validation.

## Usage

- Home page includes two navigation options:
  - Report Incident Form
  - Event Management Dashboard
- In the form page:
  - Fill out all required fields across multiple sections
  - If injuries or damage are reported, a modal opens for entering detailed information
  - Submit the form
- In the management page:
  - View events under "Handled" or "In Treatment" tabs
  - Filter events by unit name, date, event number, severity, and status
  - Use "Filter" and "Reset Filter" buttons to control results
- All pages include:
  - A "Back to Home" button
  - A dark/light mode toggle

## Features

- Multi-section incident report form
- Conditional modal for injury and damage details
- Event management dashboard with tabbed status view and advanced filtering
- Dark mode toggle
- RTL layout support
- Responsive design
- Cookie-based session handling

## Incident Form Fields

- Subunit name  
- Date and time of event  
- Event description  
- Unit activity type  
- Individual activity type  
- Domain activity type  
- Contributing factors  
- Event severity  
- Event outcomes  
- Injury and damage details (if applicable)  
- Initial recommendations  
- Location  
- Location description  
- Weather conditions  
- Coordinates (grid reference)  
- Option to open map or pin location

## Event Management Page

- Two tabs:  
  - "Handled"  
  - "In Treatment"
- Search and filter by:
  - Subunit name  
  - Date  
  - Event number  
  - Severity  
  - Status
- Buttons:
  - "Filter" – apply selected filters  
  - "Reset Filter" – clear all filters
- Ability to update event status

## Tech Stack

- React + TypeScript  
- Vite  
- react-hook-form + zod  
- CSS Modules  
- React Router  
- Cookies API

## Installation

npm install
npm run dev


## Project Structure

src/
├── assets/        # Static assets such as images or icons
├── components/    # Reusable UI components (form fields, buttons, modals)
├── constants/     # Static messages, labels, and enums
├── data/          # Dropdown options and predefined values
├── lightMode/     # Theme-related logic and styling for light/dark mode
├── pages/         # Page views: Home, Form, Event Management
├── styles/        # CSS Modules for scoped styling
├── utils/         # Helper functions, validation schemas, and handlers

Root directory includes:
- `.vscode/` – workspace settings  
- `dist/` – build output  
- `node_modules/` – project dependencies  
- `.gitignore` – Git configuration  
- `package.json` / `package-lock.json` – project metadata and dependencies  
- `tsconfig.json` – TypeScript configuration  
- `.eslintrc.json` – ESLint rules  
- `README.md` – project documentation  
- `index.html` – entry HTML file  
- `App.tsx` – main React component

