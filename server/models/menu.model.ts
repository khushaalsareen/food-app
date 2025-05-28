import mongoose, { Document } from "mongoose";

export interface IMenu {
  // _id:mongoose.Schema.Types.ObjectId;
  name: string;
  restaurant: mongoose.Schema.Types.ObjectId;
  description: string;
  price: number;
  image: string;
  quantity: number;
  rating?: number; // Optional field for average rating
  noOfRatings?: number; // Optional field for number of ratings
}

export interface IMenuRating {
  user: mongoose.Schema.Types.ObjectId;
  menu: mongoose.Schema.Types.ObjectId;
  rating: number;
}
export interface IMenuDocument extends IMenu, Document {
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new mongoose.Schema<IMenuDocument>({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    required: true
  },
  rating: {
    type: Number,
    default: 0 // Default rating is set to 0
  },
  noOfRatings: {
    type: Number,
    default: 0 // Default number of ratings is set to 0
  }
}, { timestamps: true });

const menuRatingSchema = new mongoose.Schema<IMenuRating>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

export const MenuRating = mongoose.model("MenuRating", menuRatingSchema);

export const Menu = mongoose.model("Menu", menuSchema);