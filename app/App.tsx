import React from 'react';
import { ThemeProvider } from './(tabs)/ThemeContext'; // Ensure this is imported from your theme context file
import App from './App';

export default function Main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
