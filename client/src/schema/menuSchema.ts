import {z} from "zod";

export const menuSchema = z.object({
    name:z.string().nonempty({message:"Name is required"}),
    description:z.string().nonempty({message:"description is required"}),
    price:z.number().min(0,{message:"Price can not be negative"}),
    quantity: z
  .string()
  .refine((val) => /^\d+$/.test(val), {
    message: "Quantity must be a non-negative whole number",
  }),

    image:z.instanceof(File).optional().refine((file) => file?.size !== 0, {message:"Image file is required"}),
});
export type MenuFormSchema = z.infer<typeof menuSchema>;