import React from "react";

import projectImage1 from './../../../../Shared/Assets/projectAssets/project1.png'
import projectImage2 from './../../../../Shared/Assets/projectAssets/project2.png'
import projectImage3 from './../../../../Shared/Assets/projectAssets/project3.png'

const Latestproject = () => {
  return (
    <div className="my-52 flex justify-center">
      <div>
        <h1 className="mb-8 text-2xl">Latest Project</h1>
        <div className="flex justify-between w-[70vw]">

          
            {/* project 1  */}
          <div class="  w-96 bg-base-100 hover:scale-110 transition border-gray-100 border-1 p-1 hover:shadow-2xl shadow-yellow-100 hover:shadow-yellow-200 shadow-xl">
            <figure>
              <img
                src={projectImage1}
                alt="Shoes"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">Site name</h2>
              <p><span className=" bg-slate-200 p-1 font-semibold  ">Tools & Technologies:</span> <p>Reactjs, Tailwind, HTML, CSS, JS, Expressjs, Mongodb, firebase</p></p>
              <div class="card-actions justify-center w-full">
                <a href="https://www.youtube.com" target="_blank"><button class="btn btn-primary">Go to site</button></a> 
                <a href="https://www.facebook.com" target="_blank"><button class="btn btn-primary">Source code</button></a> 
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
              <h2 class="card-title">Site name</h2>
              <p><span className=" bg-slate-200 p-1 font-semibold  ">Tools & Technologies:</span> <p>Reactjs, Tailwind, HTML, CSS, JS, Expressjs, Mongodb, firebase</p></p>
              <div class="card-actions justify-center w-full">
                <a href="https://www.youtube.com" target="_blank"><button class="btn btn-primary">Go to site</button></a> 
                <a href="https://www.facebook.com" target="_blank"><button class="btn btn-primary">Source code</button></a> 
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
            <div class="card-body">
              <h2 class="card-title">Site name</h2>
              <p><span className=" bg-slate-200 p-1 font-semibold  ">Tools & Technologies:</span> <p>Reactjs, Tailwind, HTML, CSS, JS, Expressjs, Mongodb, firebase</p></p>
              <div class="card-actions justify-center w-full">
                <a href="https://www.youtube.com" target="_blank"><button class="btn btn-primary">Go to site</button></a> 
                <a href="https://www.facebook.com" target="_blank"><button class="btn btn-primary">Source code</button></a> 
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Latestproject;
