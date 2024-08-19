import React from 'react';
import Link from 'next/link';
const Navbar = () => {
  return (
    <nav className="bg-[rgb(239,241,246)] dark:bg-rgb(0,0,0) fixed w-full z-20 top-0 ">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
      <Link href="/">

    <img src="/assets/icons/logo.png" alt="logo" className="w-48 cursor-pointer" />

</Link>

        
        <div className="hidden md:flex md:w-auto">
          <ul className="flex space-x-8 text-black">
            <li>
              <a href="#" className="hover:text-blue-500">About</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
