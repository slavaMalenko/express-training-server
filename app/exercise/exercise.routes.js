import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createNewExercise, deleteExercise, getExercise, getExercises, updateExercise } from './exercise.controller.js';

const router = express.Router();
router.route('/create').post(protect, createNewExercise);
router.route('/:id').put(protect, updateExercise).delete(protect, deleteExercise);
router.route('/').get(protect, getExercise);
router.route('/all').get(protect, getExercises);

export default router;
