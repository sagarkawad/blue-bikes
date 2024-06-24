import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

//import schemas
import { User } from "../schemas/schemas.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Check if the user is already registered
export async function existingUser(req, res, next) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log(existingUser);
      res.status(400).send("User already registered");
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function userVerify(req, res, next) {
  jwt.verify(req.body.token, JWT_SECRET, async function (error, decoded) {
    if (error) {
      res.json({ error });
    } else {
      req.decoded = decoded;
      next();
    }
  });
}
