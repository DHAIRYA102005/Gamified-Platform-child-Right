import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome, {{name}}!",
      points: "Points",
      level: "Level",
      badges: "Badges",
      playGame: "Play Game",
      leaderboard: "Leaderboard",
      myProgress: "My Progress",
      games: {
        scenario: "Story Adventure",
        quiz: "Quiz Challenge",
        dragMatch: "Match & Learn",
        spotViolation: "Spot the Issue",
        cyberSafety: "Stay Safe Online",
      },
      help: {
        childline: "Childline 1098",
        police: "Police (Dial 100)",
        emergency: "Emergency Help",
      },
      auth: {
        login: "Login",
        signup: "Sign Up",
        logout: "Logout",
        email: "Email",
        password: "Password",
        displayName: "Display Name",
        ageGroup: "Age Group",
      },
    },
  },
  hi: {
    translation: {
      welcome: "स्वागत है, {{name}}!",
      points: "अंक",
      level: "स्तर",
      badges: "बैज",
      playGame: "खेल खेलें",
      leaderboard: "लीडरबोर्ड",
      myProgress: "मेरी प्रगति",
      games: {
        scenario: "कहानी का रोमांच",
        quiz: "प्रश्नोत्तरी चुनौती",
        dragMatch: "मिलान करें",
        spotViolation: "मुद्दा खोजें",
        cyberSafety: "ऑनलाइन सुरक्षित रहें",
      },
      help: {
        childline: "चाइल्डलाइन 1098",
        police: "पुलिस (100)",
        emergency: "आपातकालीन सहायता",
      },
      auth: {
        login: "लॉगिन",
        signup: "साइन अप",
        logout: "लॉगआउट",
        email: "ईमेल",
        password: "पासवर्ड",
        displayName: "नाम",
        ageGroup: "आयु वर्ग",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
