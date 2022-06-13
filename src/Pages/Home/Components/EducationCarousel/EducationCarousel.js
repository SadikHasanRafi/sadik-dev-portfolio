import React from "react";
import battleOfMind from '../../../../Shared/Assets/award/battle_of_mindaward.jpg'
import takeOff from '../../../../Shared/Assets/award/takeoff_programming_award.jpg'
import hackathon from '../../../../Shared/Assets/award/hakathon_award.jpg'

const EducationAwardCarousel = () => {
  return (
    <div class="carousel w-full">


      {/* slider 1 */}
      <div
        id="slide1"
        class="hero carousel-item text-accent relative min-h-screen bg-yellow-50"
      >
        <div class="hero-content flex-col lg:flex-row">
          <img
            src={hackathon}
            class=" rounded-xl w-[700px] shadow-2xl  mx-6"
          />
          <div>
            <h1 class="text-5xl font-bold">Intra University Hackathon</h1>
            <p class="py-6">
             An intra university hackathon where I participated as a team of two member. Here we got the <span className=" font-bold font-xl">3<sup>rd</sup></span> position. Our project was about our university's transport system. Currently Iam working on this project.
            </p>
           
          </div>

          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" class="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" class="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>






      {/* slider 2 */}
      <div
        id="slide2"
        class="hero carousel-item relative min-h-screen text-accent bg-yellow-50 text-accent"
      >
        <div class="hero-content flex-col lg:flex-row">
          <img
           src={battleOfMind}
           class=" rounded-xl h-[700px] shadow-2xl  mx-6"
          />
          <div>
            <h1 class="text-5xl font-bold">Battle Of Mind</h1>
            <p class="py-6">
                An intra university business idea contest where I participated as a team and we present a business idea of a chatbot. Here our team got <span className=" font-bold font-xl">1<sup>st</sup></span> position.
            </p>
           
          </div>

          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" class="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" class="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>










      {/* slider 3 */}
      <div
        id="slide3"
        class="hero carousel-item relative min-h-screen bg-yellow-50 text-accent"
      >
        <div class="hero-content flex-col lg:flex-row lg:justify-evenly">
          <img
            src={takeOff}
            class=" rounded-xl w-[700px] shadow-2xl  mx-6"
          />
          <div className=" mx-6">
            <h1 class="text-5xl font-bold ">Take-off programming contest</h1>
            <p class="py-6">
                An intra university programming contest where I participate when I was in my second semester. My position was <span className="text-xl font-bold text-accent">48</span> / 450 students. This allow me to get chance in blue sheet's special programming class where senior's of our university teach us some high level programming.
            </p>
            
          </div>

        </div>
          <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" class="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" class="btn btn-circle">
              ❯
            </a>
          </div>
      </div>
      




    </div>
  );
};

export default EducationAwardCarousel;
