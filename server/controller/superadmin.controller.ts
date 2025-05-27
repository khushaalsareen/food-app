import { Request, Response } from 'express';
import { User } from "../models/user.model";

// Superadmin API to update role by email
export const grantAdminRole = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if user already admin
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'User is already admin' });
  }

  // Update role to admin
  user.role = 'admin';
  await user.save();

  res.status(200).json({ message: `Role updated to admin for user ${email}` });
};
