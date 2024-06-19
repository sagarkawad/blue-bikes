import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Check if the user is already registered
export async function existingUser(req, res, next) {
  try {
    const existingUser = await User.findOne({ email });
  } catch (err) {
    res.status(500).send(err);
  }
  if (existingUser) {
    res.status(400).send("User already registered");
  }
  next();
}

export async function userVerify(req, res, next) {
  jwt.verify(req.body.token, JWT_SECRET, async function (error, decoded) {
    if (error) {
      res.json({ error });
    } else {
      req.decoded = decoded;
    }
  });
  next();
}
