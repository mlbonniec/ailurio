import Image from './image';

interface IGenerator {
	author: string;
	repository: string;
	description: string;
}

export default class Generator extends Image {
	constructor({ author, repository, description }: IGenerator) {
		super(1200, 600);
		
		this.drawRectangle(0, 0, this.canvas.width, this.canvas.height, '#fff');
		this.drawAuthorName(author);
		this.drawRepositoryName(repository);
		this.drawDescription(description);
	}
	
	private drawAuthorName(author: string): void {
		this.drawText(`${author}/`, 100, 100, {
			color: '#2a2f35',
			font: {
				size: 75,
				family: 'sans-serif',
			},
		});
	}
	
	private drawRepositoryName(repository: string): void {
		this.drawText(repository, 100, 185, {
			color: '#2a2f35',
			font: {
				size: 75,
				family: 'sans-serif',
				weight: 'bold',
			},
		});
	}
	
	private drawDescription(description: string): void {
		this.drawMultilineText(description, 100, 300, {
			color: '#616975',
			lineHeight: 1.15,
			font: {
				size: 40,
				family: 'sans-serif',
			}
		});
	}
}
