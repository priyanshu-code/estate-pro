import * as z from "zod";
export const loginSchema = z.object({
    email: z
        .string()
        .email()
        .min(3, { message: "Email must be at least 3 characters." })
        .max(50, { message: "Max length 50 characters." }),
    password: z
        .string()
        .min(1, { message: "Please provide password" })
        .min(6, { message: 'Password must be least 6 characters.' })
});


export const registerUserSchema = z
    .object({
        name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters." })
            .max(50, { message: "Max length 50 characters." }),
        email: z.string().email().min(3, { message: 'Email must be at least 3 characters.' }).max(50, { message: 'Max length 50 characters.' }),
        password: z.string().min(6, { message: 'Password must be least 6 characters.' }).max(500, { message: 'Max length 500 characters.' }),
        confirm: z.string().min(3, { message: 'Password must be least 6 characters.' }).max(500, { message: 'Max length 500 characters.' }),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ['confirm'],
    });
