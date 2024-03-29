import { createCanvas, loadImage } from 'canvas';
import { fillTextWithTwemoji, measureText } from 'node-canvas-with-twemoji-and-discord-emoji';

interface TextOptions {
	color?: string;
	font?: {
		style?: 'normal' | 'italic' | 'oblique';
		variant?: 'normal' | 'small-caps';
		weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
		size: number;
		family: string;
	}
}

export default class Image {
	public canvas;
	public context;
	
	constructor(width: number, height: number) {
		this.canvas = createCanvas(width, height);
		this.context = this.canvas.getContext('2d');
		
		this.context.textBaseline = 'top';
	}

	public drawRectangle(x: number, y: number, width: number, height: number, color?: string): void {
		if (color)
			this.context.fillStyle = color;

		this.context.fillRect(x, y, width, height);
	}
	
	public async drawText(text: string, x: number, y: number, options?: TextOptions): Promise<number> {
		if (options?.color)
			this.context.fillStyle = options.color;

		if (options?.font) {
			const { font: { style, variant, weight, size, family } } = options;
			this.context.font = `${style || 'normal'} ${variant || 'normal'} ${weight || 'normal'} ${size}px ${family}`.trim();
		}

		await fillTextWithTwemoji(this.context, text, x, y);

		return measureText(this.context, text).width;
	}

	public async drawMultilineText(text: string, x: number, y: number, options?: TextOptions & { lineHeight?: number; width?: number; maxLine?: number; } ): Promise<void> {
		if (options?.color)
			this.context.fillStyle = options.color;

		if (options?.font) {
			const { font: { style, variant, weight, size, family } } = options;
			this.context.font = `${style} ${variant} ${weight} ${size}px ${family}`.trim();
		}

		const words = text.split(' ');
		let line = '';

		let i = 1;
		for (let n = 0; (n < words.length && (options?.maxLine && i <= options?.maxLine)); n++) {
			const testLine = line + words[n] + ' ';
			const { width } = this.context.measureText(testLine);

			if (width > (options?.width || this.canvas.width) && n > 0) {
				// Replace 3 last characters in last line
				if (i === options.maxLine)
					line = line.slice(0, -3) + '...';

				i += 1;
				await fillTextWithTwemoji(this.context, line, x, y);
				line = words[n] + ' ';

				// TODO: Replace 16 by dynamic font size
				y += (options?.lineHeight && options.font?.size) ? options.font?.size * options?.lineHeight : 16;
			}
			else
				line = testLine;
		}

		// Draw last line if line limit isn't reached
		if (options?.maxLine && i <= options?.maxLine)
			await fillTextWithTwemoji(this.context, line, x, y);
	}

	public async drawImage(buffer: Buffer, x: number, y: number, width?: number, height?: number, radius: number = 0): Promise<void> {
		const image = await loadImage(buffer);
		const finalWidth = width ?? image.width;
		const finalHeight = height ?? image.height;

		if (radius > 0)
			this.roundedImage(x, y, finalWidth, finalHeight, radius);

		this.context.drawImage(image, x, y, finalWidth, finalHeight);
		this.context.restore();
	}

	public roundedImage(x: number, y: number, width: number, height: number, radius: number) {
		this.context.save();
		this.context.beginPath();
		this.context.moveTo(x + radius, y);
		this.context.lineTo(x + width - radius, y);
		this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
		this.context.lineTo(x + width, y + height - radius);
		this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		this.context.lineTo(x + radius, y + height);
		this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
		this.context.lineTo(x, y + radius);
		this.context.quadraticCurveTo(x, y, x + radius, y);
		this.context.closePath();
		this.context.clip();
	  }
}
