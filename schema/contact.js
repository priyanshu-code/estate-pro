import { z } from 'zod';

const ContactFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).max(50, { message: 'Name cannot exceed 50 characters' }).nonempty({ message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email format' }).nonempty({ message: 'Email is required' }),
    query: z.string().max(500, { message: 'Query cannot exceed 500 characters' }).nonempty({ message: 'Query is required' }),
    offerPrice: z.number().min(0, { message: 'Offer price must be a non-negative number' }).optional().nullable(),
});

export default ContactFormSchema;
