import * as z from "zod";

export const propertySchema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty." }),
    description: z.string().min(1, { message: "Description cannot be empty." }),
    type: z.string({ required_error: "Please select a property type.", }),
    location: z.string().min(1, { message: "Location cannot be empty." }),
    price: z.number().int().min(100000, { message: "Cannot be lower than 100000" }).max(10000000000, { message: "Cannot be more than 10000000000" }).default(1000),
    area: z.number().int().min(100, { message: "Cannot be lower than 100" }).max(10000000, { message: "Cannot be more than 10000000" }).default(1000),
    bedrooms: z.number().int().min(0).max(20, { message: "Cannot add more than 20" }).default(0).optional(),
    bathrooms: z.number().int().min(0).max(20, { message: "Cannot add more than 20" }).default(0).optional(),
});

export const updatePropertySchema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty." }),
    description: z.string().min(1, { message: "Description cannot be empty." }),
    type: z.string({ required_error: "Please select a property type.", }),
    location: z.string().min(1, { message: "Location cannot be empty." }),
    price: z.number().int().min(100000, { message: "Cannot be lower than 100000" }).default(100000),
    area: z.number().int().min(100, { message: "Cannot be lower than 100" }).max(10000000, { message: "Cannot be more than 10000000" }).default(1000),
    bedrooms: z.number().int().min(0).max(20, { message: "Cannot add more than 20" }).default(0).optional(),
    bathrooms: z.number().int().min(0).max(20, { message: "Cannot add more than 20" }).default(0).optional(),
});
