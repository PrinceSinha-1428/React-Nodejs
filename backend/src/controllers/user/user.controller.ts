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
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;

    if(!user_id){
      return res.status(400).json({
        success: false,
        message: "User id is missing"
      });
    };

   const deleted = await db.models.User.destroy({
    where: { user_id }
   });

   if(!deleted){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
   }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    })
  } catch (error: unknown) {
    return resErrorHanlder(error, res)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;
    const { name, email, role } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User id is missing",
      });
    }

    const user = await db.models.User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const existing = await db.models.User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    await user.update({
      ...(name && { name: name.trim() }),
      ...(email && { email: email.trim() }),
      ...(role && { role: role.trim() }),
    });

    const { password: _, ...safeUser } = user.toJSON();
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;

    if(!user_id){
      return res.status(400).json({
        success: false,
        message: "user_id is missing"
      });
    };

    const user = await db.models.User.findByPk(user_id as string, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"]
      },
      include: [
        {
          model: db.models.Session,
          as: "sessions",
          attributes: ["session_id", "ip", "user_agent"]
        }
      ]
    });
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched Successfully",
      user
    })
  } catch (error: unknown) {
    return resErrorHanlder(error, res);
  }
}
