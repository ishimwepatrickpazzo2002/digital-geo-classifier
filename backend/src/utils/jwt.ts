import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/index';
import { env } from '../config/env';

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiry,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.jwtSecret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
