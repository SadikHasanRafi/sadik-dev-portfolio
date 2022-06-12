import React from "react";

const Header = () => {

    const menuItem = ( 
        <>
            <li><a>Projects</a></li>    
            <li><a>Awards</a></li>
            <li><a>Education & Courses</a></li>
            <li><a>Contact</a></li>
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
                stroke="currentColor"
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
              class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
             {menuItem}
             
            </ul>
            <a class="btn btn-ghost normal-case text-xl">Developer Sadik</a>
          </div>
        </div>
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal p-0">
           {menuItem}
          </ul>
        </div>

        <div class="navbar-end">
          <a class="btn btn-primary">Get started</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
