 "use server"

 export default async function getRelatedProduct(id :String){
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?category[in]=${id}`)
    const payload = await  res.json()

    return payload
 } 