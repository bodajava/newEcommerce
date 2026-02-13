import * as z from "zod";

export const checkoutSchema = z.object({
    details: z.string()
        .nonempty("Shipping details are required")
        .min(5, "Details must be at least 5 characters"),
    phone: z.string()
        .nonempty("Phone number is required")
        .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
    city: z.string()
        .nonempty("City is required")
        .min(3, "City name must be at least 3 characters"),
});

export type checkoutSchemaType = z.infer<typeof checkoutSchema>;
