import asyncHandler from 'express-async-handler';
import { prisma } from '../prisma.js';

/**
 * @desc Создание упражнения
 * @route POST api/exercises/create
 * @access Private
 */
export const createNewExercise = asyncHandler(async (req, res) => {
    try {
        const { name, time, iconPath } = req.body;

        const sameExercise = await prisma.exercise.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
            select: { name: true }
        })

        if (sameExercise) throw new Error('Such an exercise has already been registered');

        const exercise = await prisma.exercise.create({
            data: { name, time, iconPath }
        })

        res.json(exercise);
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})

/**
 * @desc Обновление упражнения
 * @route PUT api/exercises/update/:id
 * @access Private
 */
export const updateExercise = asyncHandler(async (req, res) => {
    try {
        const { name, time, iconPath } = req.body;

        const exercise = await prisma.exercise.update({
            where: { id: +req.params.id },
            data: {
                name,
                time,
                iconPath
            }
        });

        res.status(200);
        res.json(exercise);
    } catch {
        res.status(404);
        throw new Error("Exercise not found");
    }
})

/**
 * @desc Удаление упражнения
 * @route DELETE api/exercises/delete
 * @access Private
 */
export const deleteExercise = asyncHandler(async (req, res) => {
    try {
        const { count } = await prisma.exercise.deleteMany({
            where: { id: +req.params.id }
        });
        
        if (!count) throw new Error('The exercise was not found');

        res.sendStatus(200);
    } catch (error) {
        res.status(400);
        throw error;
    }
})

/**
 * @desc Получение упражнения
 * @route GET api/exercises/get
 * @access Private
 */
export const getExercise = asyncHandler(async (req, res) => {
    try {
        const { id, name } = req.query;
        const exercise = await prisma.exercise.findFirst({
            where: {
                OR: [
                    { name: { equals: name ?? '', mode: 'insensitive' } },
                    { id: id ? +id : undefined }
                ]
            },
            select: { name: true, time: true }
        })

        if (exercise) res.json(exercise);
        else throw new Error('The exercise was not found');
    } catch (error) {
        res.status(400);
        throw error;
    }
})

/**
 * @desc Получение всех упражнений
 * @route GET api/exercises/all
 * @access Private
 */
export const getExercises = asyncHandler(async (_, res) => {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
})
