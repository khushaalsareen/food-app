import { Request, Response } from "express";
import { Restaurant, RestaurantRating } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";
import { IUser, User } from "../models/user.model";
import { Menu } from "../models/menu.model";

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;


        const restaurant = await Restaurant.findOne({ user: req.id });
        if (restaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant already exist for this user"
            })
        }
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl
        });
        return res.status(201).json({
            success: true,
            message: "Restaurant Added"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate({
            path: 'menus',
            match: { quantity: { $gt: 0 } } // Only include menus with quantity > 0
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found"
            })
        };
        return res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        };
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        };
        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};
        const dishes: any = {};
        // basic search based on searchText (name ,city, country)
        // console.log(selectedCuisines);
        console.log(searchText, searchQuery, selectedCuisines);
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
                { cuisines: { $regex: searchText, $options: 'i' } },
            ]
            dishes.$or = [
                { name: { $regex: searchText, $options: 'i' } },
                { description: { $regex: searchText, $options: 'i' } }
            ];
            dishes.quantity = { $gt: 0 };
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ]
            dishes.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
            dishes.quantity = { $gt: 0 };

        }
        // console.log(query);
        // console.log(dishes);

        // ["momos", "burger"]
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines }
            dishes.cuisines = { $in: selectedCuisines }
        }
        console.log(query);
        console.log(dishes);

        const restaurants = await Restaurant.find(query);
        const dishesList = await Menu.find(dishes)
            .populate({
                path: 'restaurant',
                match: { _id: { $exists: true } }, // Only populate if restaurant ID exists
                select: 'restaurantName city country cuisines' // Select specific fields
            });

        return res.status(200).json({
            success: true,
            restaurant: restaurants,
            dishes: dishesList

        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            match: { quantity: { $gt: 0 } },
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        };
        return res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const blockAccount = async (req: Request, res: Response) => {
    try {
        const userEmailId = req.body.emailId;
        if (!userEmailId) {
            return res.status(400).json({ message: "Email ID is required" });
        }
        const user = await User.findOne({ email: userEmailId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Block the user account by setting a flag or removing the user
        user.currentStatus = "blocked";
        await user.save();
        res.status(200).json({ message: "Account blocked successfully" });


    } catch (error) {
        console.error("Error blocking account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const unBlockAccount = async (req: Request, res: Response) => {
    try {
        const userEmailId = req.body.emailId;
        if (!userEmailId) {
            return res.status(400).json({ message: "Email ID is required" });
        }
        const user = await User.findOne({ email: userEmailId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.currentStatus = "active";
        await user.save();
        res.status(200).json({ message: "Account activated successfully" });


    } catch (error) {
        console.error("Error in activating account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find().populate<{ user: IUser }>('user');

        // Filtering out restaurants whose users are either missing or blocked
        const filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.user && restaurant.user.currentStatus !== "blocked"
        );

        if (filteredRestaurants.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No restaurants found"
            });
        }

        return res.status(200).json({
            success: true,
            restaurants: filteredRestaurants
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const rateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantId, rating } = req.body;
        if (!restaurantId || !rating) {
            return res.status(400).json({ message: "Restaurant ID and rating are required" });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const existingRating = await RestaurantRating.findOne({
            user: req.id,
            restaurant: restaurantId
        });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            await RestaurantRating.create({
                user: req.id,
                restaurant: restaurantId,
                rating
            });
        }

        return res.status(200).json({ message: "Rating submitted successfully" });
    } catch (error) {
        console.error("Error submitting rating:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}