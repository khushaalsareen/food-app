import mongoose, { Document } from "mongoose";

export interface IRestaurant {
    user: mongoose.Schema.Types.ObjectId;
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: string;
    cuisines: string[];
    imageUrl: string;
    menus: mongoose.Schema.Types.ObjectId[];
    rating?: number;
    noOfRatings?: number; // Optional field for number of ratings
}

export interface IRestaurantRating {
    user: mongoose.Schema.Types.ObjectId;
    restaurant: mongoose.Schema.Types.ObjectId;
    rating: number;
}
export interface IRestaurantDocument extends IRestaurant, Document {
    createdAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new mongoose.Schema<IRestaurantDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    cuisines: [{ type: String, required: true }],
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
    imageUrl: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    noOfRatings: {
        type: Number,
        default: 0 // Default number of ratings is set to 0
    }
}, { timestamps: true });

const restaurantRatingSchema = new mongoose.Schema<IRestaurantRating>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });

export const RestaurantRating = mongoose.model("RestaurantRating", restaurantRatingSchema);
export const Restaurant = mongoose.model("Restaurant", restaurantSchema);