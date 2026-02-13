"use server"

import getMyToken from "../util/getMyToken";

export default async function getLogedUser() {
    const token = await getMyToken()

    if(!token) throw new Error('Please go to login first')

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`,{
        method : 'GET',
        headers : {
            token,
            "Content-Type": "application/json",
        },
    })
    const payload = await res.json()
    return payload
}