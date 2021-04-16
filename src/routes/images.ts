import { Router } from 'express';
import Generator from '@controllers/generator';

const router = Router();

router.get('/', (req, res, next) => {
	const img = new Generator({
		author: 'mlbonniec',
		repository: 'bild',
		description: 'Bild allows you to host and manage static content for your websites or application.'
	});
	
	const buffer = img.canvas.toBuffer();
	
	res.contentType('image/png');
	res.send(buffer);
});

export default router;
