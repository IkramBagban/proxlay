import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { NavLink } from "react-router";

const Header = () => {
  return (
    <header>
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="text-2xl font-bold">Proxlay</div>
        <nav className="flex space-x-4">
          <NavLink to="/" className="hover:text-gray-400">
            Home
          </NavLink>
          <NavLink to="/spaces" className="hover:text-gray-400">
            spaces
          </NavLink>
          <NavLink to="/upload" className="hover:text-gray-400">
            Upload
          </NavLink>
          <NavLink to="/videos" className="hover:text-gray-400">
            Videos
          </NavLink>
          <NavLink to="/about" className="hover:text-gray-400">
            About
          </NavLink>
        </nav>

        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
