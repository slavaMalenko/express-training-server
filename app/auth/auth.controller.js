import { faker } from '@faker-js/faker';
import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { hash, verify } from 'argon2';
import { generateToken } from './generate-token.js';

/**
 * @desc Создание пользователя
 * @route POST api/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) throw new Error('There is not enough data to register the user');

    const isHaveUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (isHaveUser) throw new Error('User already exists');

    const user = await prisma.user.create({
      data: {
        email, password: await hash(password), name: faker.name.fullName()
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

    res.json({
      user,
      token: generateToken(user.id)
    });
  } catch (error) {
      res.status(400);
      throw error;
  }

});

/**
 * @desc Авторизация пользователя
 * @route POST api/auth/login
 * @access Public
 */
export const authUser = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Insufficient data");
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    const isValidPassword = await verify(user.password, password);

    if (user && isValidPassword) res.json({ user, token: generateToken(user.id) });
  
    else {
      res.status(401);
      throw new Error('Email and password are not correct');
    }
  } catch (error) {
    throw error;
  }

});
