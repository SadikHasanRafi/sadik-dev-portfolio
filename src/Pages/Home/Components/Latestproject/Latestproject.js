import React from "react";

import projectImage1 from './../../../../Shared/Assets/projectAssets/project1.png'
import projectImage2 from './../../../../Shared/Assets/projectAssets/project2.png'
import projectImage3 from './../../../../Shared/Assets/projectAssets/project3.png'

const Latestproject = () => {
  return (
    <div className="my-52 flex justify-center text-accent">
      <div>
        <h1 className="mb-12 text-accent font-bold text-3xl">Latest Project</h1>
        <div className="flex gap-14 w-[70vw]">

          
            {/* project 1  */}
          <div class="  w-96 bg-base-100 hover:scale-110 transition border-gray-100 border-1 p-1 hover:shadow-2xl shadow-yellow-100 hover:shadow-yellow-200 shadow-xl">
            <figure>
              <img
                src={projectImage1}
                alt="Shoes"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title mb-5">Photography with akash</h2>
              <p><span className=" bg-slate-200 p-1 font-semibold   ">Tools & Technologies:</span> <p className=" mt-3">Reactjs, Tailwind, HTML, CSS, JS, firebase</p></p>
              <div class="card-actions justify-center w-full mt-4">
                <a href="https://store-216d6.web.app/" target="_blank"><button class="btn btn-primary">Go to site</button></a> 
                <a href="https://github.com/programming-hero-web-course-4/independent-service-provider-SadikHasanRafi/tree/main2" target="_blank"><button class="  btn btn-primary">Source code</button></a> 
              </div>
            </div>
          </div>


          {/* project 2 */}
          <div class  ="w-96 bg-base-100 hover:scale-110 transition border-gray-100 border-1 p-1 hover:shadow-2xl shadow-yellow-100 hover:shadow-yellow-200 shadow-xl">
            <figure>
              <img
                src={projectImage2}
                alt="Shoes"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title mb-5">Uphone</h2>
              <p><span className=" bg-slate-200 p-1 font-semibold   ">Tools & Technologies:</span> <p className=" mt-3">Reactjs, Tailwind, HTML, CSS, JS</p></p>
              <div class="card-actions justify-center w-full mt-4">
                <a href="https://symphonious-bublanina-23c2f8.netlify.app/" target="_blank"><button class="btn btn-primary">Go to site</button></a> 
                <a href="https://github.com/programming-hero-web-course-4/product-analysis-website-SadikHasanRafi" target="_blank"><button class="  btn btn-primary">Source code</button></a> 
              </div>
            </div>
          </div>


          {/* project 3 */}
          <div class  ="w-96 bg-base-100 hover:scale-110 transition border-gray-100 border-1 p-1 hover:shadow-2xl shadow-yellow-100 hover:shadow-yellow-200 shadow-xl">
            <figure>
              <img
                src={projectImage3}
                alt="Shoes"
              />
            </figure>
            <div class="card-body  ">
              <h2 class="card-title mb-5 ">Laptop Accessories</h2>
              <p><span className=" bg-slate-200 p-1 font-semibold   ">Tools & Technologies:</span> <p className=" mt-3">Reactjs, Tailwind, HTML, CSS, JS, Expressjs, Mongodb, firebase</p></p>
              <div class="card-actions justify-center w-full mt-4">
                <a href="https://laptop-accessories.firebaseapp.com/" target="_blank"><button class="btn btn-primary">Go to site</button></a> 
                <a href="https://github.com/programming-hero-web-course1/manufacturer-website-server-side-SadikHasanRafi" target="_blank"><button class="  btn btn-primary">Source code</button></a> 
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Latestproject;
