import React from 'react'
import HeroSection from './HeroSection'
import TestGrid from './TestGrid'
import ProductGrid from './ProductGrid'
import CropCarousel from './CropCarousel'
// import { BACKEND_URL_LINK } from '../routes/url'
function Home() {
  // console.log(BACKEND_URL_LINK);
  
  return (
    <div>
      <HeroSection/>
      <TestGrid/>
      <ProductGrid/>
      <CropCarousel/>
      <div className='d-flex text-left w-[70%] my-10 m-auto'>
        <h3 className=' font-bold text-4xl'>Why Us?</h3>
        <p className='text-xl'>Pride agro solutions launched with team of researchers .they continuously in organic farming ( fruit crops, vegetables, cotton, sugarcane, banana). Other team research in plant physiology and their response to plant nutrients, PGR, different types of irrigation water and different soil type. Our team to improve quality of agriculture process...</p>
      </div>
    </div>
  )
}

export default Home
