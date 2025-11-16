import express from "express";
import { oauth2Client } from "../utils/googleClient"
import { UserModel } from "../models/user.model";

const router = express.Router();

router.get("/login", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Save user tokens
  await UserModel.findOneAndUpdate(
    { googleId: tokens.id_token }, 
    {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    { upsert: true }
  );

  res.send("Authentication saved!");
});


export default router;
