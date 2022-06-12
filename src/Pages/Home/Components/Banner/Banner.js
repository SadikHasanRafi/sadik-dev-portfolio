import React from "react";
import image from './../../../../Shared/Assets/banner_photo.png'

const Banner = () => {
  return (
    <div >
      
      <div class=" flex h-[90vh] items-center justify-evenly">
        <img src={image} class="w-5/12" />
        
        <div className="w-4/12">
          <h1 class="text-5xl  font-bold">Box Office News!</h1>
          <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
          <button class="btn btn-primary">Get Started</button>
        </div>
      </div>

    </div>
  );
};

export default Banner;
