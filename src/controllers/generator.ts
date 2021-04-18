import { readFileSync } from 'fs';
import { join } from 'path';
import type { TransformedLanguages } from 'types/languages';
import Image from './image';

type Data = Partial<Record<keyof typeof Icons, number>>;

interface IGenerator {
	author: string;
	repository: string;
	description: string;
	languages: TransformedLanguages;
	avatar: Buffer;
	data: Data
};

const Icons = {
	contributors: {
		name: 'Contributors',
		path: '../assets/icons/contributors.svg'
	},
	forks: {
		name: 'Forks',
		path: '../assets/icons/forks.svg'
	},
	issues: {
		name: 'Issues',
		path: '../assets/icons/issues.svg'
	},
	stars: {
		name: 'Stars',
		path: '../assets/icons/stars.svg'
	},
}

export default class Generator extends Image {
	private options: IGenerator;

	constructor(options: IGenerator) {
		super(1200, 600);
		
		this.options = options;
	}
	
	private drawBackground(): void {
		this.drawRectangle(0, 0, this.canvas.width, this.canvas.height, '#fff');
	}
	
	private drawAuthorName(author: string): void {
		this.drawText(`${author}/`, 85, 100, {
			color: '#2a2f35',
			font: {
				size: 75,
				family: 'sans-serif',
			},
		});
	}
	
	private drawRepositoryName(repository: string): void {
		this.drawText(repository, 85, 185, {
			color: '#2a2f35',
			font: {
				size: 75,
				family: 'sans-serif',
				weight: 'bold',
			},
		});
	}
	
	private drawDescription(description: string): void {
		this.drawMultilineText(description, 85, 300, {
			color: '#616975',
			lineHeight: 1.25,
			font: {
				size: 35,
				family: 'sans-serif',
			}
		});
	}
	
	private drawLanguages(languages: TransformedLanguages): void {
		const barsHeight: number = 25;
		const y = this.canvas.height - barsHeight;
		let x: number = 0;

		languages.forEach(e => {
			const width = this.canvas.width * (e.ratio/100);
			this.drawRectangle(x, y, width, barsHeight, e.color ?? '#ccc');
			x += width;
		});
	}

	private async drawAvatar(avatar: Buffer): Promise<void> {
		await this.drawImage(avatar, 915, 85, 200, 200);
	}
	
	private drawData(data: Data): void {
		let x = 85;
		for (const e of Object.entries(data)) {
			const [key, value] = e as [keyof typeof Icons, number | undefined];
			if (value === undefined)
				return;

			const image = readFileSync(join(__dirname, Icons[key].path));

			this.drawImage(image, x, 450);			
			this.drawText(value.toString(), x+45, 450, {
				color: '#2a2f35',
				font: {
					size: 30,
					family: 'sans-serif',
				}
			});

			const { width } = this.drawText(Icons[key].name, x+45, 485, {
				color: '#616975',
				font: {
					size: 25,
					family: 'sans-serif',
					weight: 'lighter'
				}
			});

			x += (width + 75)
		}
	}
	
	public async init(): Promise<void> {
		const { author, description, languages, repository, avatar, data } = this.options;

		this.drawBackground();
		this.drawAuthorName(author);
		this.drawRepositoryName(repository);
		this.drawDescription(description);
		this.drawLanguages(languages);
		this.drawData(data);

		await this.drawAvatar(avatar);
	}
}
