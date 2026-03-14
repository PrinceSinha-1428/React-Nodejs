import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { resErrorHanlder } from "@/config/error.handler";
import { NODE_ENV } from "@/config/env.environment";
import { generateToken } from "@/config/helper";
import db from "@/models";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Credentials",
        user: null,
      });
    }
    const user = await db.models.User.findOne({
      where: { email },
      attributes: ["name", "email", "user_id", "password", "role"],
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        user: null,
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
        user: null,
      });
    }
    const user_id = user.user_id;
    const role =  user.role;
    const token = generateToken({ user_id, email, role }, 1, "d");
    const { password: _, ...safeUser } = user;
    res.cookie("token", token, {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 10,
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: safeUser,
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("token", { path: "/" });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {
        isLoggedOut: true,
        route: "/",
      },
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};
