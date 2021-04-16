import { createCanvas } from 'canvas';
import canvasTxt from 'canvas-txt';

interface TextOptions {
	color?: string;
	font?: {
		style?: 'normal' | 'italic' | 'oblique';
		variant?: 'normal' | 'small-caps';
		weight?: 'normal' | 'bold' | 'bolder' | 'lighter';
		size?: number;
		family?: string;
	}
}

export default class Image {
	public canvas;
	public context;
	
	constructor(width: number, height: number) {
		this.canvas = createCanvas(width, height);
		this.context = this.canvas.getContext('2d');
	}

	public drawRectangle(x: number, y: number, width: number, height: number, color?: string): void {
		if (color)
			this.context.fillStyle = color;

		this.context.fillRect(x, y, width, height);
	}
	
	public drawText(text: string, x: number, y: number, options?: TextOptions): void {		
		if (options?.color)
			this.context.fillStyle = options.color;

		if (options?.font) {
			const { font: { style, variant, weight, size, family } } = options;
			this.context.font = `${style} ${variant} ${weight} ${size}px ${family}`.trim();
		}

		this.context.textBaseline = 'top';
		this.context.fillText(text, x, y);
	}
	
	public drawMultilineText(text: string, x: number, y: number, options?: TextOptions & { lineHeight?: number } ): void {
		this.context.textBaseline = 'bottom';
		this.context.fillStyle = '#616975';

		canvasTxt.font = options?.font?.family ?? 'Arial';
		canvasTxt.fontSize = options?.font?.size ?? 14;
		canvasTxt.align = 'left';
		canvasTxt.vAlign = 'top';
		canvasTxt.lineHeight = options?.lineHeight ? canvasTxt.fontSize * options?.lineHeight : null;
		
		canvasTxt.drawText(this.context, text, x, y, 700, 200);
	}
}
