import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { users } from '../schemas/index';
import { generateToken } from '../utils/jwt';
import { AppError, createError } from '../utils/errors';
import type { RegisterInput, LoginInput } from '../validators/auth';

export const authService = {
  async register(input: RegisterInput) {
    const { fullName, email, password } = input;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      throw createError(409, 'Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db
      .insert(users)
      .values({
        fullName,
        email,
        passwordHash,
      })
      .returning();

    const user = result[0];

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName, // Changed from user.full_name
        email: user.email,
      },
      token,
    };
  },

  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (result.length === 0) {
      throw createError(401, 'Invalid email or password');
    }

    const user = result[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Changed from user.password_hash

    if (!isPasswordValid) {
      throw createError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        fullName: user.fullName, // Changed from user.full_name
        email: user.email,
      },
      token,
    };
  },

  async getCurrentUser(userId: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      throw createError(404, 'User not found');
    }

    const user = result[0];

    return {
      id: user.id,
      fullName: user.fullName, // Changed from user.full_name
      email: user.email,
    };
  },
};