import mongoose from "mongoose";
import express from "express";

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
