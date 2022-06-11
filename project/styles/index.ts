import { StyleSheet } from 'react-native';

export class Theme {
	private _theme: 'light' | 'dark' = 'light';
	private _styles: StyleSheet.NamedStyles<unknown> = StyleSheet.create({});

	constructor(theme: 'light' | 'dark') {
		this._theme = theme;
		this._styles = StyleSheet.create({
			container: {
				backgroundColor: theme == 'light' ? '#0f0' : '#f00'
			}
		});
	}

	public get theme(): 'light' | 'dark' {
		return this._theme;
	}

	public set theme(theme: 'light' | 'dark') {
		this._theme = theme;
	}

	public get styles(): StyleSheet.NamedStyles<unknown> {
		return this._styles;
	}
}
