interface Language {
	name: string;
	color: string | null;
	ratio: number;
}

export type Colors = Record<string, string>;
export type GithubLanguages = Record<string, number>
export type TransformedLanguages = Language[];
