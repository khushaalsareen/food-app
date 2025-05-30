import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu, MenuRating } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

export const addMenu = async (req: Request, res: Response) => {
    try {
        const { name, description, price, quantity } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        };
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu: any = await Menu.create({
            name,
            description,
            price,
            image: imageUrl,
            quantity: quantity,
        });
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (restaurant) {
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            restaurant.cuisines.push(name); // Assuming you want to add the menu name to cuisines
            await restaurant.save();
        }
        menu.restaurant = restaurant?._id;
        await menu.save();
        return res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const editMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!"
            })
        }
        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = price;
        if (quantity) menu.quantity = quantity;

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

        return res.status(200).json({
            success: true,
            message: "Menu updated",
            menu,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const rateMenu = async (req: Request, res: Response) => {
    try {
        const { menuId, rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }
        const menu = await Menu.findById(menuId);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found"
            });
        }
        const existingRating = await MenuRating.findOne({ user: req.id, menu: menuId });
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            const newRating = new MenuRating({
                user: req.id,
                menu: menuId,
                rating
            });
            await newRating.save();
        }

        return res.status(200).json({
            success: true,
            message: "Menu rated successfully",
            menu
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

