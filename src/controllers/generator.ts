import { readFileSync } from 'fs';
import { join } from 'path';
import type { TransformedLanguages } from 'types/languages';
import Image from './image';

type Data = Partial<Record<keyof typeof Icons, boolean>>;

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
	
	private async drawData(data: Data): Promise<void> {
		// console.log(data);
		// 85 450
		const image = readFileSync(join(__dirname, Icons.contributors.path))
		
		await this.drawImage(image, 85, 450);
		this.drawText('226', 130, 450, {
			color: '#2a2f35',
			font: {
				size: 30,
				family: 'sans-serif',
			}
		});
		
		this.drawText(Icons.contributors.name, 130, 485, {
			color: '#616975',
			font: {
				size: 25,
				family: 'sans-serif',
				weight: 'lighter'
			}
		});
	}
	
	public async init(): Promise<void> {
		const { author, description, languages, repository, avatar, data } = this.options;

		this.drawBackground();
		this.drawAuthorName(author);
		this.drawRepositoryName(repository);
		this.drawDescription(description);
		this.drawLanguages(languages);

		// await this.drawImage('../assets/icons/contributors.svg', 85, 465);
		// await this.drawImage('https://avatars.githubusercontent.com/u/29955402?v=4', 85, 465);
		await this.drawAvatar(avatar);
		await this.drawData(data);
	}
}
