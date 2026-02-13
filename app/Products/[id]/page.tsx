import React from 'react';
import SelectTheProducts from '@/app/-Components/ProductAPI/SelectProduct';
import getAllProduct from '@/app/-Components/ProductAPI/getAllProduct.api';
import ProductDetailsUI from './ProductDetailsUI';
import getRelatedProduct from '@/app/-Components/ProductAPI/relatedProduct.action';

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await SelectTheProducts(id);
  const relatedProduct = await getRelatedProduct(data.category._id)

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Product not found</h2>
        </div>
      </div>
    );
  }

  // Fetch all products to find related ones (same category)
  const allProducts = await getAllProduct();
  const relatedProducts = allProducts.filter((p: any) =>
    p.category?._id === data.category?._id && p._id !== data._id
  );

  return <ProductDetailsUI data={data} relatedProducts={relatedProducts} />;
}