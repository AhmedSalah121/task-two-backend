import { Request, Response } from 'express';
import { UserRepository } from '../models';
import makeAuthService from '../services/auth';

const authService = makeAuthService(UserRepository);

export const AuthController = {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
      }

      const result = await authService.register({ email, username, password });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const result = await authService.login({ username, password });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },
};

export default AuthController;
