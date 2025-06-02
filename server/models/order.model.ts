import mongoose, { Document } from "mongoose";

type DeliveryDetails = {
    email: string;
    name: string;
    address: string;
    city: string;
}

type CartItems = {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    restaurant: mongoose.Schema.Types.ObjectId;
    deliveryDetails: DeliveryDetails,
    cartItems: CartItems[];
    totalAmount: number;
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered" | "failed" | "cancelled" | "cart" | "paymentdone" | "paymentfailed" | "outfordelivery" | "delivered";
}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    deliveryDetails: {
        email: {
            type: String,
            // not required if status is cart
            required: function () { return this.status !== "cart"; }
        },
        name: {
            type: String,
            // not required if status is cart
            required: function () { return this.status !== "cart"; }
        },
        address: {
            type: String,
            // not required if status is cart
            required: function () { return this.status !== "cart"; }
        },
        city: {
            type: String,
            // not required if status is cart
            required: function () { return this.status !== "cart"; }
        },
    },
    cartItems: [
        {
            menuId: { type: String, required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "confirmed", "preparing", "done", "failed", "cancelled", "cart", "paymentdone", "paymentfailed", "outfordelivery", "delivered"],
        required: true
    }


}, { timestamps: true });
export const Order = mongoose.model("Order", orderSchema);