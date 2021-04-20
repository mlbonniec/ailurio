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
		const getFontPath = (filename: string): string => join(__dirname, '../assets/fonts/', filename);

		// TODO: Fix wrong font weight
		registerFont(getFontPath('SF-Pro-Display-Light.otf'), { family: 'SFProDisplay', weight: '300' });
		registerFont(getFontPath('SF-Pro-Display-Regular.otf'), { family: 'SFProDisplay', weight: 'normal' });
		registerFont(getFontPath('SF-Pro-Display-Bold.otf'), { family: 'SFProDisplay', weight: '700' });

		super(1200, 600);
		
		this.options = options;
	}
	
	private drawBackground(): void {
		this.drawRectangle(0, 0, this.canvas.width, this.canvas.height, '#fff');
	}
	
	private drawAuthorName(author: string): void {
		this.drawText(`${author}/`, 85, 85, {
			color: '#2a2f35',
			font: {
				size: 75,
				family: 'SFProDisplay',
				weight: 300
			},
		});
	}
	
	private drawRepositoryName(repository: string): void {
		this.drawText(repository, 85, 170, {
			color: '#2a2f35',
			font: {
				size: 75,
				family: 'SFProDisplay',
				weight: 700
			},
		});
	}
	
	private async drawDescription(description: string): Promise<void> {
		await this.drawMultilineText(description, 85, 285, {
			color: '#616975',
			lineHeight: 1.25,
			width: 700,
			maxLine: 3,
			font: {
				size: 35,
				family: 'SFProDisplay',
				weight: 300
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
	
	private async drawData(data: Data): Promise<void> {
		let x = 85;
		for (const e of Object.entries(data)) {
			const [key, value] = e as [keyof typeof Icons, number | undefined];
			if (value === undefined)
				return;

			const image = readFileSync(join(__dirname, Icons[key].path));

			this.drawImage(image, x, 480);
			this.drawText(formattedValue, x+45, 475, {
				color: '#2a2f35',
				font: {
					size: 30,
					family: 'SFProDisplay',
					weight: 300
				}
			});

			const width = await this.drawText(Icons[key].name, x+45, 510, {
				color: '#616975',
				font: {
					size: 25,
					family: 'SFProDisplay',
					weight: 300
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

		await this.drawDescription(description);
		await this.drawAvatar(avatar);
	}
}
