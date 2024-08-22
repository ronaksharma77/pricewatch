import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card group">
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl">
        <div className="product-card_img-container">
          <img
            src={product.image}
            alt={product.title}
            width={200}
            height={200}
            className="h-40 w-1/2 object-cover"
          />
        </div>

        <div className="p-4 bg-white">
          <h3 className="product-title text-lg font-semibold truncate">{product.title}</h3>

          <div className="flex justify-between items-center mt-2 border-t pt-2">
            <p className="text-black opacity-50 text-lg capitalize">
              {product.category}
            </p>

            <p className="text-black text-lg font-semibold">
              <span>{product?.currency}</span>
              <span>{product?.currentPrice}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
