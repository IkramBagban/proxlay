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
          <NavLink to="/workspace" className="hover:text-gray-400">
            Workspace
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
