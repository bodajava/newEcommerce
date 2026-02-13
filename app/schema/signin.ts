import * as z from "zod";

export const signinSchema = z.object({

    email : z.email().nonempty("this email faild can't be empty"),

    password : z.string().nonempty("this password faild can't be empty")
    .min(6,"minmum length 6 hcars"),


})

export type signinSchemaType = z.infer<typeof signinSchema>