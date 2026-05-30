import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types/index';

const secret = process.env.JWT_SECRET || 'your-secret-key';
const expiry = process.env.JWT_EXPIRY || '7d';

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
