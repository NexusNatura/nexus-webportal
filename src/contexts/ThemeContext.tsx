import React, { createContext, useContext } from 'react';
export const ThemeContext = createContext({ theme: 'light', setTheme: (t: string) => {} });
export const ThemeProvider = ({ children, defaultTheme }: any) => <ThemeContext.Provider value={{ theme: defaultTheme, setTheme: () => {} }}>{children}</ThemeContext.Provider>;

