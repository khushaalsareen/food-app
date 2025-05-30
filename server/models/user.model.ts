import mongoose, { Document, Model } from "mongoose";

export interface IUser {
    fullname: string;
    email: string;
    password: string;
    contact: number;
    address: string;
    city: string;
    country: string;
    profilePicture: string;
    lastLogin?: Date;
    isVerified?: boolean;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date
    role?: "user" | "admin" | "superadmin";
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: {
        //     validator: function (email: string) {
        //         return email.endsWith("@nitj.ac.in")
        //     },
        //     message: "Email must end with @nitj.ac.in"
        // },
        // match: [/@nitj\.ac\.in$/, "Email must end with @nitj.ac.in"]
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: "Update your address"
    },
    city: {
        type: String,
        default: "Update your city"
    },
    country: {
        type: String,
        default: "Update your country"
    },
    profilePicture: {
        type: String,
        default: "",
    },
    // advanced authentication
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);