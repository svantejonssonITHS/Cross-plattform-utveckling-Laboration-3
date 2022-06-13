// External dependencies
import { Provider } from 'react-redux';

// Internal dependencies
import Router from './Router';
import { store } from './Store';

export default function App() {
	return (
		<Provider store={store}>
			<Router />
		</Provider>
	);
}
