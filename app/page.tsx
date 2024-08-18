import React from 'react';
import Serchbar from '../components/Searchbar';
import HeroCarousel from '../components/HeroCarousel';
import { getAllProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';
import { all } from 'axios';
const Home = async () => {
  const allProducts = await getAllProducts();
  
  return (
    
    <div>
      <section className="px-20 py-24">
        <div className="flex flex-col md:flex-row gap-12">
        <HeroCarousel/>
          <div className="flex flex-col justify-center">
            <p className="text-sm flex items-center">
              Track prices and buy products at the best price
              <img
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                className="ml-2 w-4 h-4"
              />
            </p>

            <h1 className="text-3xl md:text-5xl font-bold mt-4">
              Experience the Future of shopping with
              <span> PriceWatch</span>
            </h1>

            <p className="mt-4 text-gray-700">
              Empowering you with advanced product and growth insights to boost your conversions, engagement, and retention.
            </p>
            <Serchbar/>
          </div>
         
        </div>
      </section>

      <section className="explore-section px-20 py-4">
        <h1 className="section-text mb-4">
          Explore
        </h1>
      
      <div className="flex flex-wrap gap-x-8 gap-y-8">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        </section>
    </div>
  );
};

export default Home;
