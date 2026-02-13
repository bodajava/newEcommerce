"use server"
import getMyToken from "../util/getMyToken";

export default async function deleteItemCartt (id:(string)) {
    
const token = await getMyToken()
if(!token) throw new Error('Please login to access this feature')
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,{
method:'DELETE',
headers:{
    token,
    "Content-Type": "application/json",
}

})
const payload = await res.json()
return payload
}