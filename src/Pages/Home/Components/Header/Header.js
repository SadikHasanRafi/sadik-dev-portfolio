import React from "react";

const Header = () => {

    const menuItem = ( 
        <>
            <li className="hover:bg-primary rounded-lg font-semibold "><a>Projects</a></li>    
            <li className="hover:bg-primary rounded-lg font-semibold "><a>Awards</a></li>
            <li className="hover:bg-primary rounded-lg font-semibold "><a>Education & Courses</a></li>
            <li className="hover:bg-primary rounded-lg font-semibold "><a>Contact</a></li>
        </>
    );

  return (
    <div className="lg:px-5">
      <div class="navbar bg-base-100">
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
            <a class="btn btn-ghost bg-base-100 hover:bg-base-100 font-extrabold text-accent normal-case text-xl">SadikDev</a>
          </div>
        </div>
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal p-0 text-accent  ">
           {menuItem}
          </ul>
        </div>

        <div class="navbar-end">
          <a class="btn btn-primary text-accent hover:btn-secondary hover:text-white">Download resume</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
