import {z} from "zod";

export const restaurantFromSchema = z.object({
    restaurantName:z.string().nonempty({message:"Restaurant name is required"}),
    city:z.string().nonempty({message:"City is required"}),
    country:z.string().nonempty({message:"Country is required"}),
deliveryTime: z.string().min(1, { message: "Delivery time is required" }),

    cuisines:z.array(z.string()),
    imageFile:z.instanceof(File).optional().refine((file) => file?.size !== 0, {message:"Image file is required"}),
    rating: z.number().min(0).max(5).optional(),
});

export type RestaurantFormSchema = z.infer<typeof restaurantFromSchema>;
