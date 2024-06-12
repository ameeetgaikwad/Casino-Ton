'use client';
import React, { ComponentProps } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

interface ThemeProviderProps extends ComponentProps<typeof NextThemeProvider> {}
export const ThemeProvider = ({ ...props }: ThemeProviderProps) => {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
			{...props}
		/>
	);
};
