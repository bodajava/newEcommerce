import getMyToken from "../util/getMyToken"

export default async function updateCartAction(id:string , count:number) {
    
const token = await getMyToken()
if(!token) throw new Error('Please login to access this feature')
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,{
method:'PUT',
headers:{
    token,
    "Content-Type": "application/json",
},
body: JSON.stringify({count})

})
const payload = await res.json()
return payload
}