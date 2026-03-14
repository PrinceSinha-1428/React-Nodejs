import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { resErrorHanlder } from "@/config/error.handler";
import db from "@/models";


export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isExist = await db.models.User.findOne({ where: { email } });
    if (isExist) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.models.User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });
    const { password: _, ...safeUser } = newUser.toJSON();
    return res.status(201).json({
      success: true,
      message: "User created Successfully",
      user: safeUser,
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.models.User.findAll();
    return res.status(200).json({
      success: true,
      message: "All users",
      data: users,
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};
