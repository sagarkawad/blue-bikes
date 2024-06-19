import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;



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
