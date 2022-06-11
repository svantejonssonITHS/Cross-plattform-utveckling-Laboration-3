// External dependencies
import React from 'react';

export default React.createContext({
	theme: 'light' as 'light' | 'dark',
	setTheme: () => {}
});
