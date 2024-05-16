import asyncHandler from 'express-async-handler';
import { prisma } from '../prisma.js';

/**
 * @desc Получение профиля пользователя
 * @route GET api/user/profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: 3
            },
            select: {
                id: true,
                createdAt: true,
                email: true,
                images: true,
                updatedAt: true,
                name: true,
            }
        })

        if (user) res.json(user);
        else throw new Error("The user was not found");
    } catch (error) {
        throw error;
    }
})