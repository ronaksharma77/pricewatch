import ChartModal from "@/components/chartModal";
import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string }
}

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);
  
  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);
  const truncatedDescription = product.description.split(' ').slice(0, 100).join(' ') + (product.description.split(' ').length > 100 ? '...' : '');

   // Initialize starRatings
   const starRatings = [
    { label: "5 star", count: 0 },
    { label: "4 star", count: 0 },
    { label: "3 star", count: 0 },
    { label: "2 star", count: 0 },
    { label: "1 star", count: 0 }
  ];

  // Extracting star ratings from description
  const starRatingPattern = /(\d+)%/g;
  const starLabels = ["5 star", "4 star", "3 star", "2 star", "1 star"];
  let match;
  let index = 0;

  // Extracting percentages from description
  while ((match = starRatingPattern.exec(product.description)) !== null) {
    if (index < 5) {
      const percentage = parseInt(match[1], 10);
      starRatings[index].count = percentage;
      index++;
    }
  }
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image 
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>

              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image 
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {product.reviewsCount}
                </p>
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image 
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>

              <div className="p-2 bg-white-200 rounded-10">
                <Image 
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-black opacity-50 line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image 
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || '25'}
                  </p>
                </div>

                <div className="product-reviews">
                  <Image 
                    src="/assets/icons/comment.svg"
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>

              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">78% </span> of
                buyers have recommended this.
              </p>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5 ">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard 
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
              />
              <PriceInfoCard 
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
              />
              <PriceInfoCard 
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
              />
              <PriceInfoCard 
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-5">
          <Modal productId={id}  />
           <ChartModal priceHistory={JSON.stringify(product.priceHistory)} /> 
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Product Description
        </h3>
        <p className="text-sm text-gray-600">
          {truncatedDescription}
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-center text-xl font-semibold text-gray-800 mb-4">
          Ratings
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {starRatings.map(rating => (
            <div key={rating.label} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-800">
                {rating.label}
              </div>
              <div className="text-xl font-bold text-gray-900">
                {rating.count}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button className="btn">
          <Link href="/" className="text-center">
            Try More Products
          </Link>
        </button>
      </div>

      {similarProducts && similarProducts.length > 0 && (
        <div className="py-14 flex flex-col gap-2">
          <p className="text-xl font-semibold text-gray-800">Similar Products</p>
          <div className="flex flex-wrap gap-4 mt-7">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;