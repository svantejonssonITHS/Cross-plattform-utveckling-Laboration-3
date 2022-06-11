// External dependencies
import React from 'react';

// Internal dependencies
import { ITimezone } from '../interfaces';

export default React.createContext({
	allTimezones: [] as string[],
	savedTimezones: [] as ITimezone[]
});
