import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  mode: 'light' | 'dark';
}

const themes: Theme[] = [
  {
    id: 'blue-light',
    name: 'Ocean Blue (Light)',
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1F2937',
    mode: 'light'
  },
  {
    id: 'blue-dark',
    name: 'Ocean Blue (Dark)',
    primary: '#60A5FA',
    secondary: '#34D399',
    accent: '#FBBF24',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    mode: 'dark'
  },
  {
    id: 'purple-light',
    name: 'Royal Purple (Light)',
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1F2937',
    mode: 'light'
  },
  {
    id: 'purple-dark',
    name: 'Royal Purple (Dark)',
    primary: '#A78BFA',
    secondary: '#22D3EE',
    accent: '#FBBF24',
    background: '#0C0A09',
    surface: '#1C1917',
    text: '#F5F5F4',
    mode: 'dark'
  },
  {
    id: 'green-light',
    name: 'Forest Green (Light)',
    primary: '#10B981',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#1F2937',
    mode: 'light'
  },
  {
    id: 'green-dark',
    name: 'Forest Green (Dark)',
    primary: '#34D399',
    secondary: '#60A5FA',
    accent: '#FBBF24',
    background: '#0A0A0A',
    surface: '#171717',
    text: '#F5F5F5',
    mode: 'dark'
  },
  {
    id: 'orange-light',
    name: 'Sunset Orange (Light)',
    primary: '#F97316',
    secondary: '#10B981',
    accent: '#3B82F6',
    background: '#FFFBEB',
    surface: '#FFFFFF',
    text: '#1F2937',
    mode: 'light'
  },
  {
    id: 'orange-dark',
    name: 'Sunset Orange (Dark)',
    primary: '#FB923C',
    secondary: '#34D399',
    accent: '#60A5FA',
    background: '#0C0A09',
    surface: '#1C1917',
    text: '#F5F5F4',
    mode: 'dark'
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  toggleMode: () => void;
  isDarkMode: boolean;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    // Load saved theme
    const savedThemeId = localStorage.getItem('flowdesk_theme');
    const savedLogo = localStorage.getItem('flowdesk_logo');
    
    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) setCurrentTheme(theme);
    }
    
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables and document
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--color-secondary', currentTheme.secondary);
    root.style.setProperty('--color-accent', currentTheme.accent);
    root.style.setProperty('--color-background', currentTheme.background);
    root.style.setProperty('--color-surface', currentTheme.surface);
    root.style.setProperty('--color-text', currentTheme.text);

    // Apply dark/light mode class to document
    if (currentTheme.mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = currentTheme.background;
      document.body.style.color = currentTheme.text;
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = currentTheme.background;
      document.body.style.color = currentTheme.text;
    }
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('flowdesk_theme', themeId);
    }
  };

  const toggleMode = () => {
    const currentMode = currentTheme.mode;
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    
    // Find the same color theme but in the opposite mode
    const baseThemeId = currentTheme.id.replace('-light', '').replace('-dark', '');
    const newThemeId = `${baseThemeId}-${newMode}`;
    
    const newTheme = themes.find(t => t.id === newThemeId);
    if (newTheme) {
      setTheme(newThemeId);
    }
  };

  const handleSetCustomLogo = (logo: string | null) => {
    setCustomLogo(logo);
    if (logo) {
      localStorage.setItem('flowdesk_logo', logo);
    } else {
      localStorage.removeItem('flowdesk_logo');
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themes,
      setTheme,
      toggleMode,
      isDarkMode: currentTheme.mode === 'dark',
      customLogo,
      setCustomLogo: handleSetCustomLogo
    }}>
      {children}
    </ThemeContext.Provider>
  );
};