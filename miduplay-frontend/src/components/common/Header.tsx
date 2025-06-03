import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import {
  Youtube,
  Shield,
  Users,
  Upload,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Lock,
  PlayCircle,
  UserCheck,
  Clock,
  Sparkles,
  ChevronDown,
  LogIn
} from "lucide-react";
import { NavLink } from 'react-router';

const Header = () => {
  const { isSignedIn, user } = useUser();
 
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <header className='pb-15 bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      {/* <div className=""> */}
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Youtube className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Proxlay
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </NavLink>
                <NavLink to="pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </NavLink>
                <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  How it Works
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-gray-900 transition-colors">
                  Testimonials
                </button>
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <SignInButton mode="modal">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        </nav>
      {/* </div> */}

    </header>
  );
};

export default Header;
