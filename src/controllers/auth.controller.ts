import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ResponseUtil } from "../utils/response.util";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.register({ email, password, name });
      res.status(201).json(ResponseUtil.success(result, "User registered successfully"));
    } catch (error: any) {
      res.status(error.statusCode || 400).json(ResponseUtil.error(error.message));
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });
      res.status(200).json(ResponseUtil.success(result, "Login successful"));
    } catch (error: any) {
      res.status(error.statusCode || 401).json(ResponseUtil.error(error.message));
    }
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.status(200).json(ResponseUtil.success(result, "Token refreshed"));
    } catch (error: any) {
      res.status(error.statusCode || 401).json(ResponseUtil.error(error.message));
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.status(200).json(ResponseUtil.success(null, result.message));
    } catch (error: any) {
      res.status(error.statusCode || 500).json(ResponseUtil.error(error.message));
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;
      const result = await this.authService.resetPassword({ token, password });
      res.status(200).json(ResponseUtil.success(null, result.message));
    } catch (error: any) {
      res.status(error.statusCode || 400).json(ResponseUtil.error(error.message));
    }
  };
}