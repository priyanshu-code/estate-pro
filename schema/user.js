import * as z from "zod";
export const userSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name cannot be empty." })
        .max(50, { message: "Max length 50 characters." }),
});
