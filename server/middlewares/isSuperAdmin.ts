import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({ message: "User ID missing from request" });
    }

    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
