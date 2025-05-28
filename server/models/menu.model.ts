import mongoose, { Document } from "mongoose";

export interface IMenu {
  // _id:mongoose.Schema.Types.ObjectId;
  name: string;
  restaurant: mongoose.Schema.Types.ObjectId;
  description: string;
  price: number;
  image: string;
  quantity: number;
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
  }
}, { timestamps: true });

export const Menu = mongoose.model("Menu", menuSchema);