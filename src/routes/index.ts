
import { Router } from 'express';
import images from './images';
import repo from './repository';

const router = Router();

router.use('/images', images);
router.use('/repository', repo);

export default router;
