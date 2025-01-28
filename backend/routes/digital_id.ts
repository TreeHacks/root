require("dotenv").config();
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
import { Request, Response } from "express";

const secretKey = process.env.JWT_SECRET;

function generateToken(userId, userName) {
  const payload = { id: userId, name: userName };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

export async function getAppleId(req: Request, res: Response) {
  const baseDomain: string = process.env.ID_URL; // TODO: adjust based on env value
  const token = generateToken(req.params.userId, req.params.fullName);
  const response = await fetch(baseDomain + "/applePass/" + token, {
    method: "GET",
  });

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Failed to generate Apple Pass",
      details: await response.text(),
    });
  }

  // convert to base64 string, because amplify doesn't support binary data
  const arrayBuffer = await response.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  return res.status(200).json({
    filename: "treehacksID.pkpass",
    contentType: "application/vnd.apple.pkpass",
    content: base64Data,
  });
}

export async function getGoogleId(req: Request, res: Response) {
  const baseDomain: string = process.env.ID_URL; // TODO: adjust based on env value
  const token = generateToken(req.params.userId, req.params.fullName);
  const response = await fetch(baseDomain + "/googlePass/" + token, {
    method: "GET",
  });

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Failed to generate Google Pass",
      details: await response.text(),
    });
  }

  const data = await response.json();
  return res.status(200).json({
    content: data.url,
  });
}
