import React from 'react';
import {
  HeroSection,
  CategorySection,
  TrendingProducts,
  BestSellingProducts,
  DiscountSection,
  ContactSection
} from '../components/home';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <CategorySection />
      <TrendingProducts />
      <DiscountSection />
      <BestSellingProducts />
      <ContactSection />
    </div>
  );
};

export default Home;