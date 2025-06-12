import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Search, Users, Briefcase, TrendingUp, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 gradient-secondary">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Find Your Next
            <span className="text-primary block">Blue Collar Career</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Connect with top employers and discover opportunities in skilled trades, manufacturing, construction, and more.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="flex gap-2">
              <Input
                placeholder="Search jobs by title, company, or location..."
                className="search-focus bg-card border-border text-foreground text-lg py-6"
              />
              <Button size="lg" className="gradient-primary px-8">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/search">Browse All Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">10,000+</h3>
              <p className="text-muted-foreground">Active Job Listings</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">50,000+</h3>
              <p className="text-muted-foreground">Registered Workers</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">95%</h3>
              <p className="text-muted-foreground">Job Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 px-4 bg-card border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Popular Job Categories</h2>
            <p className="text-muted-foreground text-lg">Explore opportunities in various trades</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Electrical", count: "1,200+ jobs" },
              { name: "Construction", count: "2,500+ jobs" },
              { name: "Automotive", count: "800+ jobs" },
              { name: "Manufacturing", count: "1,800+ jobs" },
              { name: "Plumbing", count: "600+ jobs" },
              { name: "HVAC", count: "900+ jobs" },
              { name: "Welding", count: "700+ jobs" },
              { name: "Heavy Equipment", count: "500+ jobs" }
            ].map((category, index) => (
              <Card key={index} className="job-card-hover bg-background border-border cursor-pointer">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {category.count}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Start Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of skilled workers who have found their dream jobs through our platform.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="gradient-primary">
              <Link to="/search">Find Jobs Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
