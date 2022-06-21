import React from "react";

const Header = () => {

  const handleHome = () => {
    window.scrollTo(-10,0)
  }  
  
  function handleProjects(){
    
    window.scrollTo(400,800)
  }

  function handleAwards(){
   
  }
 

    const menuItem = ( 
        <>
            <li className="hover:bg-primary rounded-lg font-semibold "><input type='button' onClick={handleProjects} value='Projects' /></li>    
            <li className="hover:bg-primary rounded-lg font-semibold "><input type='button' onClick={handleAwards} value='Awards' /></li>
            <li className="hover:bg-primary rounded-lg font-semibold "><input type='button'  value='Education & Courses' /> </li>
            <li className="hover:bg-primary rounded-lg font-semibold "><input type='button' value='Contact' /></li>
        </>
    );
    

  return (
    <div className="lg:px-5">
      <div class="navbar fixed z-10 bg-base-100">
        <div class="navbar-start">
          <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#0f172a"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabindex="0"
              class="menu menu-compact dropdown-content rounded-lg border-0 text-accent shadow bg-base-100  w-full"
            >
             {menuItem}
             
            </ul>
            <p onClick={handleHome} class="btn border-l-6 border-stone-50 btn-ghost bg-base-100 hover:bg-base-100 font-extrabold text-accent normal-case text-xl">SadikDev<span className=" font-extrabold text-primary text-4xl mb-3">.</span></p>
          </div>
        </div>
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal p-0 text-accent  ">
           {menuItem}
          </ul>
        </div>

        <div class="navbar-end">
          <a class="btn btn-primary md:mr-6 text-accent hover:btn-secondary hover:text-white">Download resume</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
