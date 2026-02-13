
export default async function getAllBrands() {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands`,{
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json',
        },
    })    
    const data = await res.json()
    return data
}