import React from 'react';
import getAllProduct from '../-Components/ProductAPI/getAllProduct.api';
import ProductsComponent from '../-Components/product';

export default async function Products() {
  const data = await getAllProduct();
  
  return (
    <ProductsComponent data={data} />
  );
}
