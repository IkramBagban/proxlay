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
import Header from '@/components/common/Header';

const ProxlayLanding = () => {
  const { isSignedIn, user } = useUser();
  const features = [
    {
      icon: Shield,
      title: "Secure Collaboration",
      description: "Never share your YouTube credentials again. Keep your account secure while enabling team collaboration.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Add team members to your workspace and manage their permissions with granular control.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Upload,
      title: "Streamlined Uploads",
      description: "Team members can upload videos with complete details, thumbnails, and metadata through our intuitive interface.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: CheckCircle,
      title: "Approval Workflow",
      description: "Review and approve content before it goes live. Maintain quality control with a simple approval process.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Create Workspace",
      description: "Set up your workspace and connect your YouTube channel securely",
      icon: Youtube
    },
    {
      step: "02",
      title: "Invite Team",
      description: "Add team members and assign appropriate permissions",
      icon: UserCheck
    },
    {
      step: "03",
      title: "Upload Content",
      description: "Team uploads videos with descriptions, tags, and thumbnails",
      icon: Upload
    },
    {
      step: "04",
      title: "Review & Approve",
      description: "Review content and approve for publishing to YouTube",
      icon: CheckCircle
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      content: "Proxlay changed how I work with my team. No more sharing passwords or worrying about account security!",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random"
    },
    {
      name: "Mike Chen",
      role: "YouTube Manager",
      content: "The approval workflow is perfect. I can review everything before it goes live and maintain quality control.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=random"
    },
    {
      name: "Emma Davis",
      role: "Digital Agency Owner",
      content: "Managing multiple client channels has never been easier. Proxlay is a game-changer for agencies.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=random"
    }
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      {/* <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
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
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-gray-900 transition-colors">
                How it Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </button>
              <NavLink to="pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </NavLink>
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
      </nav> */}

      <Header />

      {/* Hero Section */}
      <section className="pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Secure YouTube Collaboration Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Collaborate on YouTube
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Without Sharing Passwords
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Enable your team to upload and manage YouTube content while keeping your account credentials secure. 
                Perfect for creators, agencies, and businesses who value security and collaboration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSignedIn ? (
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                </SignInButton>
              )}
              <Button size="lg" variant="outline" className="border-2 text-lg px-8 py-6 rounded-xl hover:bg-gray-50">
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by creators worldwide</p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-red-600" />
                  <span className="font-semibold">YouTube</span>
                </div>
                <div className="text-gray-300">•</div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">5.0 Rating</span>
                </div>
                <div className="text-gray-300">•</div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">10K+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> secure collaboration</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proxlay provides all the tools you need to manage your YouTube content creation process securely and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Clock className="h-3 w-3 mr-1" />
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Get started in
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 4 simple steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Setting up secure YouTube collaboration has never been easier. Follow these steps to get your team up and running.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center h-full">
                  <CardHeader className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="space-y-2">
                      <step.icon className="h-8 w-8 mx-auto text-blue-600" />
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Star className="h-3 w-3 mr-1" />
              Customer Love
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              What our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> users say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real users have to say about Proxlay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to secure your YouTube collaboration?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of creators who trust Proxlay to manage their content creation process securely.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg">
                <PlayCircle className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
              </SignInButton>
            )}
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 rounded-xl">
              Schedule Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="pt-8 space-y-4">
            <p className="text-blue-100">No credit card required • 14-day free trial • Cancel anytime</p>
            <div className="flex justify-center items-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="text-sm">256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Youtube className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Proxlay</span>
              </div>
              <p className="text-gray-400">
                Secure YouTube collaboration platform for creators and teams.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-gray-400">
                <p>Features</p>
                <p>Pricing</p>
                <p>Security</p>
                <p>API</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-gray-400">
                <p>About</p>
                <p>Blog</p>
                <p>Careers</p>
                <p>Contact</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-gray-400">
                <p>Help Center</p>
                <p>Documentation</p>
                <p>Status</p>
                <p>Privacy Policy</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Proxlay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProxlayLanding;