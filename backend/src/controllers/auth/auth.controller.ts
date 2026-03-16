import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { resErrorHanlder } from "@/config/error.handler";
import { ENV, NODE_ENV } from "@/config/env.service";
import { generateToken } from "@/config/helper.service";
import db from "@/models";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }

    if (role === "Admin" || role === "Super Admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only Admins can create this role",
      });
    }

    const isAlreadyRegistered = await db.models.User.findOne({
      where: { email },
    });
    if (isAlreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.models.User.create({
      name: name.trim(),
      email: email.trim(),
      role: "User",
      password: hashedPassword,
    });

    const refreshToken = generateToken({ user_id: newUser.user_id, email, role: newUser.role }, 1, "d");
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await db.models.Session.create({
      user_id: newUser.user_id,
      refresh_token_hash: refreshTokenHash,
      ip: req.ip || "",
      revoked: false,
      user_agent: req.headers["user-agent"] || "",
    });
    const accessTokenPayload = {
      user_id: newUser.user_id,
      sessionId: session.session_id,
      email,
      role: newUser.role,
    };
    const accessToken = generateToken(accessTokenPayload, 15, "m");
    const sessionExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 10,
      path: "/",
    });
    res.cookie("sessionExpiresAt", String(sessionExpiresAt), {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    const { password: _, ...safeUser } = newUser.toJSON();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
      accessToken,
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};

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
        message: "User not found, Please sign up",
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
    const role = user.role;

    const refreshToken = generateToken({ user_id, email, role }, 1, "d");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await db.models.Session.create({
      user_id,
      refresh_token_hash: refreshTokenHash,
      ip: req.ip || "",
      revoked: false,
      user_agent: req.headers["user-agent"] || "",
    });
    const accessToken = generateToken(
      { user_id, sessionId: session.session_id, email, role },  15, "m");

    const { password: _, ...safeUser } = user;

    const sessionExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 10,
      path: "/",
    });
    res.cookie("sessionExpiresAt", String(sessionExpiresAt), {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: safeUser,
      accessToken,
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not found",
      });
    }
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const session = await db.models.Session.findOne({
      where: {
        refresh_token_hash: refreshTokenHash,
        revoked: false,
      },
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
    });
    res.clearCookie("accessToken", {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
    });
    res.clearCookie("sessionExpiresAt", {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {
        isLoggedOut: true,
        route: "/sign-in",
      },
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "refreshToken not found",
      });
    }
    const decoded = jwt.verify(refreshToken, ENV[NODE_ENV].jwt_secret) as {
      user_id: string;
      email: string;
      role: string;
    };
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await db.models.Session.findOne({
      where: {
        refresh_token_hash: refreshTokenHash,
        revoked: false,
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    const userExists = await db.models.User.findOne({
      where: { user_id: decoded.user_id },
    });
    if (!userExists) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        path: "/",
      });
      res.clearCookie("accessToken", {
        httpOnly: false,
        sameSite: "lax",
        secure: NODE_ENV === "production",
        path: "/",
      });
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    const payload = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };

    const newRefreshToken = generateToken(payload, 1, "d");

    session.revoked = true;
    await session.save();

    const newRefreshTokenHash = crypto.createHash("sha256") .update(newRefreshToken).digest("hex");
    await db.models.Session.create({
      user_id: decoded.user_id,
      refresh_token_hash: newRefreshTokenHash,
      ip: req.ip || "",
      revoked: false,
      user_agent: req.headers["user-agent"] || "",
    });
    const accessToken = generateToken(payload, 15, "m");

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 10,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Access Token refreshed successfully",
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};

export const logoutAll = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not found",
      });
    }
    const decoded = jwt.verify(refreshToken, ENV[NODE_ENV].jwt_secret) as {
      user_id: string;
      email: string;
      role: string;
    };
    await db.models.Session.update(
      { revoked: true },
      {
        where: {
          user_id: decoded.user_id,
          revoked: false,
        },
      },
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
    });
    res.clearCookie("accessToken", {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
    });
    res.clearCookie("sessionExpiresAt", {
      httpOnly: false,
      sameSite: "lax",
      secure: NODE_ENV === "production",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {
        isLoggedOut: true,
        route: "/sign-in",
      },
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
};
