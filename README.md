# MednCare - React Version

A complete React.js conversion of the MednCare medical management application.

## Features

- **Home Page**: Landing page with hero section and feature cards
- **Medication Tracker**: Add, view, and manage medications with weekly calendar
- **Medicine Timer**: Set reminders and alarms for medications
- **Health Records**: Record and track health measurements (blood pressure, sugar, weight, etc.)
- **Authentication**: Login/signup system with protected routes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd medncare-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
medncare-react/
├── public/
│   ├── Fauget.jpg          # Logo image
│   ├── login-img.jpg        # Login background
│   ├── signup-img.jpg       # Signup background
│   └── index.html
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.js
│   │   ├── AuthModal.js
│   │   ├── Hero.js
│   │   └── Features.js
│   ├── pages/               # Page components
│   │   ├── Home.js
│   │   ├── Tracker.js
│   │   ├── Timer.js
│   │   └── Records.js
│   ├── context/             # React Context
│   │   └── AuthContext.js
│   ├── hooks/               # Custom hooks
│   │   ├── useLocalStorage.js
│   │   └── useTypewriter.js
│   ├── utils/               # Utility functions
│   │   └── alarm.js
│   ├── App.js               # Main app component
│   ├── App.css              # All styles
│   └── index.js             # Entry point
```

## Key Technologies

- **React 19**: UI library
- **React Router DOM**: Client-side routing
- **LocalStorage**: Data persistence
- **Context API**: State management for authentication

## Features Converted

✅ All HTML pages converted to React components
✅ All JavaScript functionality converted to React hooks
✅ Authentication system with protected routes
✅ LocalStorage integration for data persistence
✅ Responsive design maintained
✅ All original styling preserved

## Usage

1. **Sign Up/Login**: Click "LOG IN" to create an account or sign in
2. **Add Medications**: Go to Tracker page to add medications
3. **Set Reminders**: Use Timer page to set medication reminders
4. **Record Health Data**: Use Records page to log health measurements

## Notes

- All data is stored in browser localStorage
- Authentication is client-side only (for demo purposes)
- Images should be in the `public` folder to be accessible
