import { Request, Response } from "express";
import { Restaurant, RestaurantRating } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";
import { IUser, User } from "../models/user.model";
import { Menu } from "../models/menu.model";
import { sendEmail } from "../mailtrap/email";

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
            match: { quantity: { $gt: 0 }, currentStatus: "active" } // Only include menus with quantity > 0
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
        // get email from order from userId
        const user = await User.findById(order.user);
        const email = user?.email || null; // Use optional chaining to safely access email
        if (email) {
            const htmlEmailTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Status Update</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        margin: 0; 
                        padding: 0; 
                        background-color: #f8f9fa; 
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 20px auto; 
                        background: white; 
                        border-radius: 12px; 
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                    }
                    .header { 
                        background: linear-gradient(135deg, #ff6b35, #f7931e);
                        color: white;
                        text-align: center; 
                        padding: 30px 20px;
                    }
                    .logo { 
                        font-size: 28px; 
                        font-weight: bold; 
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .status-update {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .status-badge { 
                        display: inline-block; 
                        padding: 12px 24px; 
                        background: linear-gradient(135deg, #28a745, #20c997);
                        color: white; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        text-transform: uppercase; 
                        font-size: 16px; 
                        letter-spacing: 1px;
                        box-shadow: 0 2px 10px rgba(40, 167, 69, 0.3);
                    }
                    .message { 
                        font-size: 18px; 
                        color: #333; 
                        text-align: center; 
                        margin: 25px 0;
                        line-height: 1.8;
                    }
                    .order-info {
                        background: #f8f9fa;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 25px 0;
                        border-left: 4px solid #ff6b35;
                    }
                    .thank-you {
                        text-align: center;
                        font-size: 16px;
                        color: #666;
                        margin: 30px 0;
                        padding: 20px;
                        background: linear-gradient(135deg, #fff5f5, #fff0e6);
                        border-radius: 8px;
                    }
                    .footer { 
                        background: #2c3e50;
                        color: #ecf0f1;
                        text-align: center; 
                        padding: 25px 20px;
                        font-size: 14px;
                    }
                    .footer-logo {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #ff6b35;
                    }
                    .social-links {
                        margin: 15px 0;
                    }
                    .social-links a {
                        color: #ff6b35;
                        text-decoration: none;
                        margin: 0 10px;
                        font-weight: 500;
                    }
                    @media (max-width: 600px) {
                        .container { margin: 10px; }
                        .content { padding: 20px; }
                        .header { padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">
                            🍽️ CampusBites
                        </div>
                        <h1 style="margin: 0; font-size: 24px; font-weight: 300;">Order Status Update</h1>
                    </div>
                    
                    <div class="content">
                        <div class="message">
                            Great news! We have an update on your order.
                        </div>
                        
                        <div class="status-update">
                            <p style="font-size: 16px; color: #666; margin-bottom: 15px;">
                                Your order status has been updated to:
                            </p>
                            <div class="status-badge">${status}</div>
                        </div>
                        
                        <div class="order-info">
                            <h3 style="margin: 0 0 10px 0; color: #333;">📋 Order Details</h3>
                            <p style="margin: 5px 0; color: #666;">
                                <strong>Order ID:</strong> #${order._id}<br>
                                 <strong>Status:</strong> ${status}<br>
                                <strong>Updated:</strong> ${new Date().toLocaleString()}
                            </p>
                        </div>
                        
                        <div class="thank-you">
                            <h3 style="margin: 0 0 10px 0; color: #ff6b35;">🙏 Thank You!</h3>
                            <p style="margin: 0; color: #666;">
                                Thank you for choosing CampusBites. We appreciate your business and hope you enjoy your meal!
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666; font-size: 14px;">
                                Need help? Contact our support team at 
                                <a href="mailto:support@CampusBites.com" style="color: #ff6b35; text-decoration: none;">support@CampusBites.com</a>
                            </p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-logo">CampusBites</div>
                        <p style="margin: 10px 0;">Delivering happiness to your doorstep</p>
                        <div class="social-links">
                            <a href="#">Privacy Policy</a> | 
                            <a href="#">Terms of Service</a> | 
                            <a href="#">Contact Us</a>
                        </div>
                        <p style="font-size: 12px; color: #95a5a6; margin: 15px 0 0 0;">
                            This is an automated message. Please do not reply to this email.<br>
                            © 2025 CampusBites. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `;

            await sendEmail(
                email,
                htmlEmailTemplate,
                "Order Status Update - CampusBites",
            );
        }
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
                { cuisines: { $regex: searchQuery, $options: 'i' } },
                { city: { $regex: searchQuery, $options: 'i' } },
                { country: { $regex: searchQuery, $options: 'i' } },

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
        query.$and = [
            { currentStatus: "active" }
        ]
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines }
            dishes.cuisines = { $in: selectedCuisines }
        }
        console.log(query);
        console.log(dishes);

        const restaurants = await Restaurant.find(query);
        const dishesList = await Menu.aggregate([
            {
                $lookup: {
                    from: 'restaurants', // collection name of Restaurant model (usually pluralized)
                    localField: 'restaurant',
                    foreignField: '_id',
                    as: 'restaurant',
                },
            },
            {
                $unwind: '$restaurant',
            },
            {
                $match: {
                    'restaurant.currentStatus': 'active',
                    ...dishes, // apply your other filters here
                },
            }
        ]);


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
        const { email } = req.body;
        let restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
        });
        if (!restaurant) {
            restaurant = await Restaurant.findOne({ user: email }).populate({
                'path': 'menus',
            });
        }
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
        const resId = req.body.id;
        if (!resId) {
            return res.status(400).json({ message: "Restaurant ID is required" });
        }
        const restaurant = await Restaurant.findById(resId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // Block the restaurant account by setting the status to blocked
        restaurant.currentStatus = "blocked";
        await restaurant.save();
        res.status(200).json({ message: "Account blocked successfully" });

    } catch (error) {
        console.error("Error blocking account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const unBlockAccount = async (req: Request, res: Response) => {
    try {
        const resId = req.body.id;
        if (!resId) {
            return res.status(400).json({ message: "Restaurant ID is required" });
        }

        const restaurant = await Restaurant.findById(resId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        // Unblock the restaurant account by setting the status to active
        restaurant.currentStatus = "active";
        await restaurant.save();
        res.status(200).json({ message: "Account unblocked successfully" });

    } catch (error) {
        console.error("Error in activating account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// export const getAllRestaurants = async (req: Request, res: Response) => {
//     try {
//         const restaurants = await Restaurant.find().populate<{ user: IUser }>('user');

//         // Filtering out restaurants whose users are either missing or blocked
//         const filteredRestaurants = restaurants.filter(
//             (restaurant) => restaurant.user && restaurant.user.currentStatus !== "blocked"
//         );

//         if (filteredRestaurants.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No restaurants found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             restaurants: filteredRestaurants
//         });
//     } catch (error) {
//         console.error("Error fetching restaurants:", error);
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };


export const getAllBlockedRestaurants = async (req: Request, res: Response) => {
    try {
        // Step 1: Fetch the requesting user
        const loggedInUser = await User.findById(req.id);
        if (!loggedInUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Step 2: Fetch all restaurants with populated user data
        const restaurants = await Restaurant.find({
            currentStatus: "blocked" // Only fetch active restaurants
        }).populate<{ user: IUser }>('user');

        // Step 3: If not superadmin, filter out restaurants with blocked users
        let filteredRestaurants = restaurants;
        if (loggedInUser.role !== "superadmin") {
            filteredRestaurants = restaurants.filter(
                (restaurant) => restaurant.user && restaurant.currentStatus !== "blocked"
            );
        }

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

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        // Step 1: Fetch the requesting user
        const loggedInUser = await User.findById(req.id);
        if (!loggedInUser) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Step 2: Fetch all restaurants with populated user data
        const restaurants = await Restaurant.find({
            currentStatus: "active" // Only fetch active restaurants
        }).populate<{ user: IUser }>('user');

        // Step 3: If not superadmin, filter out restaurants with blocked users
        let filteredRestaurants = restaurants;
        if (loggedInUser.role !== "superadmin") {
            filteredRestaurants = restaurants.filter(
                (restaurant) => restaurant.user && restaurant.currentStatus !== "blocked"
            );
        }

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