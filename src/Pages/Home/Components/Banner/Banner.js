import React from "react";
import image from './../../../../Shared/Assets/banner_photo.png'

const Banner = () => {
  return (
    <div >
      
      <div class=" flex h-[90vh] items-center justify-evenly">
        <img src={image} class="w-5/12" />
        
        <div className="w-4/12">
          <h1 class="text-5xl text-accent font-bold">Hello !</h1>
          <p class="py-6 text-accent">It is <span className="text-xl text-yellow-500 font-bold">Md. Sadik Hasan Rafi</span>. I am a passionate web developer. I am an undergraduate student, study in Computer Science and Engineering, comfortable with <span className=" text-orange-500 font-semibold text-lg">HTML</span>, <span className=" text-blue-500 font-semibold text-lg">CSS</span>, <span className=" text-yellow-500 font-semibold text-lg">JS</span>, <span className=" text-info font-semibold text-lg">Reactjs</span>, <span className=" text-teal-500 font-semibold text-lg">tailwind CSS</span></p>
          <button class="btn btn-primary">Hire me</button>
        </div>
      </div>

    </div>
  );
};

export default Banner;
