const tintColorLight = '#7E57C2';
const tintColorDark = '#9575CD';

export default {
  light: {
    primary: '#7E57C2', // Purple
    secondary: '#26A69A', // Teal
    accent: '#EC407A', // Pink
    success: '#4CAF50',
    warning: '#FFA000',
    error: '#F44336',
    background: '#FFFFFF',
    secondaryBackground: '#F5F5F5',
    cardBackground: '#FFFFFF',
    text: '#121212',
    secondaryText: '#757575',
    border: '#E0E0E0',
    tabIconDefault: '#757575',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#9575CD', // Lighter Purple for dark mode
    secondary: '#4DB6AC', // Lighter Teal for dark mode
    accent: '#F06292', // Lighter Pink for dark mode
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#E57373',
    background: '#121212',
    secondaryBackground: '#1E1E1E',
    cardBackground: '#1E1E1E',
    text: '#FFFFFF',
    secondaryText: '#AAAAAA',
    border: '#2C2C2C',
    tabIconDefault: '#AAAAAA',
    tabIconSelected: tintColorDark,
  },
};