import type { Request, Response } from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { error } from "console";

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";

export async function registerUser(
  req: Request,
  res: Response
): Promise<Response> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All Fields are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: "User Registered Successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error during registration" });
  }

  //return res.json({ message: "User Has Register" });
}

export async function loginUser(
  req: Request,
  res: Response
): Promise<Response> {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ error: "Email and password required" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or Password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error during Login" });
  }

  //return res.json({ message: "Welcome Back User" });
}
