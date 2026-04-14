import express from 'express';
import { getAllPostes, createPoste, deletePoste } from '../controllers/posteController.js';

const router = express.Router();

router.get('/', getAllPostes);
router.post('/', createPoste);
router.delete('/:id', deletePoste);

export default router;