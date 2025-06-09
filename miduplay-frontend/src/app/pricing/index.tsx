import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Crown,
  Shield,
  Building,
  Users,
  Video,
  HardDrive,
  Star,
  ArrowRight,
  Mail,
  Youtube,
  Lock,
  UserCheck,
  Zap,
  Globe
} from 'lucide-react';
import Header from '@/components/common/Header';
import { usePayment } from '@/hooks/use-payment';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Shield,
      price: {
        monthly: 19.99,
        annual: 199.99
      },
      description: 'Perfect for solo creators and small teams',
      tagline: 'Great for growing channels',
      features: {
        workspaces: 1,
        members: 3,
        videos: 20,
        storage: '50 GB',
        channels: '1 YouTube channel',
        approval: 'Basic approval workflow',
        support: 'Email support'
      },
      highlights: [
        'Secure credential management',
        'Basic video approval workflow',
        'YouTube integration'
      ],
      popular: false,
      color: 'blue',
      bestFor: 'Individual creators with small teams'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: {
        monthly: 49.99,
        annual: 499.99
      },
      description: 'Best for established creators and agencies',
      tagline: 'Most popular for content teams',
      features: {
        workspaces: 3,
        members: 10,
        videos: 75,
        storage: '250 GB',
        channels: '3 YouTube channels',
        approval: 'Advanced approval workflow',
        support: 'Priority support'
      },
      highlights: [
        'Multiple channel management',
        'Advanced approval controls',
        'Team collaboration tools',
        'Priority support'
      ],
      popular: true,
      color: 'purple',
      bestFor: 'Content agencies and established creators'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building,
      price: {
        monthly: 'Custom',
        annual: 'Custom'
      },
      description: 'Tailored for large organizations and MCNs',
      tagline: 'For enterprise-scale operations',
      features: {
        workspaces: 'Unlimited',
        members: 'Unlimited',
        videos: 'Unlimited',
        storage: 'Unlimited',
        channels: 'Unlimited channels',
        approval: 'Custom approval workflows',
        support: '24/7 dedicated support'
      },
      highlights: [
        'White-label solutions',
        'Custom integrations',
        'Advanced security & compliance',
        'Dedicated account manager',
        'Custom approval workflows'
      ],
      popular: false,
      color: 'green',
      bestFor: 'MCNs, agencies, and large organizations'
    }
  ];

  const allFeatures = [
    {
      category: 'Channel & Workspace Management',
      features: [
        { name: 'YouTube Workspaces', basic: '1', pro: '3', enterprise: 'Unlimited' },
        { name: 'Team Members per Workspace', basic: '3', pro: '10', enterprise: 'Unlimited' },
        { name: 'YouTube Channels', basic: '1', pro: '3', enterprise: 'Unlimited' },
        { name: 'Channel Authorization', basic: true, pro: true, enterprise: true },
        { name: 'Multi-Channel Dashboard', basic: false, pro: true, enterprise: true },
        { name: 'White-label Interface', basic: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'Video Upload & Management',
      features: [
        { name: 'Video Uploads per Month', basic: '20', pro: '75', enterprise: 'Unlimited' },
        { name: 'Storage Limit', basic: '50 GB', pro: '250 GB', enterprise: 'Unlimited' },
        { name: 'HD Video Upload (1080p)', basic: true, pro: true, enterprise: true },
        { name: '4K Video Upload', basic: false, pro: true, enterprise: true },
        { name: 'Bulk Video Operations', basic: false, pro: true, enterprise: true },
        { name: 'Video Scheduling', basic: true, pro: true, enterprise: true },
        { name: 'Custom Thumbnails', basic: true, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Approval & Security',
      features: [
        { name: 'Basic Approval Workflow', basic: true, pro: true, enterprise: true },
        { name: 'Multi-level Approval', basic: false, pro: true, enterprise: true },
        { name: 'Custom Approval Rules', basic: false, pro: false, enterprise: true },
        { name: 'Secure Credential Storage', basic: true, pro: true, enterprise: true },
        { name: 'Team Role Management', basic: true, pro: true, enterprise: true },
        { name: 'Audit Logs', basic: false, pro: true, enterprise: true },
        { name: 'Advanced Security Controls', basic: false, pro: false, enterprise: true }
      ]
    },
    {
      category: 'Collaboration & Analytics',
      features: [
        { name: 'Team Comments & Feedback', basic: true, pro: true, enterprise: true },
        { name: 'Video Preview & Review', basic: true, pro: true, enterprise: true },
        { name: 'Upload Analytics', basic: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
        { name: 'Team Performance Insights', basic: false, pro: true, enterprise: true },
        { name: 'Custom Reports', basic: false, pro: false, enterprise: true },
        { name: 'API Access', basic: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Support & Integration',
      features: [
        { name: 'Email Support', basic: true, pro: true, enterprise: true },
        { name: 'Priority Support', basic: false, pro: true, enterprise: true },
        { name: '24/7 Dedicated Support', basic: false, pro: false, enterprise: true },
        { name: 'Onboarding Assistance', basic: false, pro: true, enterprise: true },
        { name: 'Custom Integrations', basic: false, pro: false, enterprise: true },
        { name: 'Dedicated Account Manager', basic: false, pro: false, enterprise: true }
      ]
    }
  ];

  const getDiscountPercentage = (plan) => {
    if (plan.price.monthly === 'Custom') return 0;
    const monthlyTotal = plan.price.monthly * 12;
    const annualPrice = plan.price.annual;
    return Math.round(((monthlyTotal - annualPrice) / monthlyTotal) * 100);
  };

  const formatPrice = (price) => {
    if (price === 'Custom') return 'Custom';
    return `$${price}`;
  };

  const getPlanColor = (color) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };


  const {handlePayment} = usePayment();

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-4">
            <Badge className="bg-red-100 text-red-800 mb-4">
              <Youtube className="h-3 w-3 mr-1" />
              YouTube Channel Management
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Secure YouTube Collaboration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let your team upload videos to your YouTube channel without sharing credentials. 
              Maintain full control with approval workflows.
            </p>
            <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span>No credential sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span>Approval workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Youtube className="h-4 w-4 text-red-500" />
                <span>Direct YouTube upload</span>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <Badge variant="secondary" className="ml-2">
                  Save up to 17%
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const colors = getPlanColor(plan.color);
            const Icon = plan.icon;
            const discount = getDiscountPercentage(plan);

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  plan.popular
                    ? 'ring-2 ring-purple-500 shadow-lg scale-105'
                    : selectedPlan === plan.id
                    ? `ring-2 ${colors.border} shadow-md`
                    : 'hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg}`}>
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{plan.tagline}</p>
                    <p className="text-xs text-gray-500 mt-2">{plan.bestFor}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      {plan.price[billingCycle] !== 'Custom' && (
                        <span className="text-gray-600">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'annual' && discount > 0 && (
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        Save {discount}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Features */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Youtube className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{plan.features.channels}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        {plan.features.workspaces} workspace{plan.features.workspaces !== 1 ? 's' : ''} • {plan.features.members} members
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Video className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">
                        {plan.features.videos} videos/month
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <HardDrive className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {plan.features.storage} storage
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{plan.features.approval}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    {plan.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full ${
                      plan.popular ? 'bg-purple-600 hover:bg-purple-700' : colors.button
                    }`}
                    // onClick={() => setSelectedPlan(plan.id)}
                    onClick={() => handlePayment(plan.name.toLowerCase() as "basic" | "pro", false, 'false')}
                  >
                    {plan.id === 'enterprise' ? (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Sales
                      </>
                    ) : (
                      <>
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {plan.id !== 'enterprise' && (
                    <p className="text-xs text-center text-gray-500">
                      14-day free trial • No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              How Proxlay Works
            </h2>
            <p className="text-lg text-gray-600">
              Secure YouTube collaboration in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Workspace",
                description: "Set up your workspace and authorize your YouTube channel securely",
                icon: Lock,
                color: "bg-blue-100 text-blue-600"
              },
              {
                step: "2",
                title: "Invite Team",
                description: "Add team members without sharing your YouTube credentials",
                icon: Users,
                color: "bg-green-100 text-green-600"
              },
              {
                step: "3",
                title: "Upload & Review",
                description: "Team uploads videos with details. You review and approve",
                icon: Video,
                color: "bg-purple-100 text-purple-600"
              },
              {
                step: "4",
                title: "Publish to YouTube",
                description: "Approved videos automatically publish to your YouTube channel",
                icon: Youtube,
                color: "bg-red-100 text-red-600"
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.color} mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Compare All Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need for secure YouTube collaboration
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    Basic
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Pro</span>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allFeatures.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {feature.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-600">{feature.basic}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-600">{feature.pro}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-600">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Proxlay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How secure is my YouTube channel?",
                answer: "Your credentials never leave Google's secure servers. We use OAuth2 authentication, so your password is never shared with team members or stored on our servers."
              },
              {
                question: "Can I control what my team uploads?",
                answer: "Absolutely! Every video must be approved by you before it goes live on YouTube. You have complete control over what gets published to your channel."
              },
              {
                question: "What happens if I cancel my subscription?",
                answer: "You'll retain access to your workspace until the end of your billing period. Your YouTube channel authorization can be revoked at any time through your Google account settings."
              },
              {
                question: "Can team members see my channel analytics?",
                answer: "No, team members can only upload videos and see their upload status. Only workspace owners have access to channel analytics and settings."
              },
              {
                question: "Do you support other platforms besides YouTube?",
                answer: "Currently we focus exclusively on YouTube, but we're planning to add support for other social media platforms in the future."
              },
              {
                question: "Is there a limit on video file size?",
                answer: "Video file size limits depend on your plan's storage allocation. We support all video formats that YouTube accepts, including 4K videos on Pro and Enterprise plans."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <Youtube className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your YouTube Workflow?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join creators who trust Proxlay to manage their team collaboration safely
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Youtube className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-red-200 mt-4">
            14-day free trial • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;