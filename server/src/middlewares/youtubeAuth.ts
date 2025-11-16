import { oauth2Client } from "../utils/googleClient";
import { UserModel } from "../models/user.model";
import { NextFunction, Request, Response } from "express";

export const youtubeAuth = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findOne();

  if (!user) return res.status(401).send("Login with YouTube first.");

  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  next();
};
