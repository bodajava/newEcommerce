import * as z from "zod";

export const regesterSchema = z.object({
    name : z.string()
    .nonempty("this name faild can't be empty")
    .min(2,"minimum length is 2 !!")
    .max(10,"the maxmum is 10!! "),

    email : z.email().nonempty("this email faild can't be empty"),

    password : z.string().nonempty("this password faild can't be empty")
    .min(6,"minmum length 6 hcars"),

    rePassword : z.string().nonempty("tthe rePassword don't match password "),

    phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number"),

}).refine((object) => object.password === object.rePassword ,{
    path:[`rePassword`],
    error:"password && repassword not match  "
} )

export type regesterSchemaType = z.infer<typeof regesterSchema>