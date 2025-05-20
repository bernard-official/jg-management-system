'use sever'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Header from "@/components/Header"; // Your existing Header component
import { ArrowRight, Utensils, BarChart } from "lucide-react"; // Icons for CTAs
import { createClient } from "@/utils/supabase/server";
// import { Profile } from "@/components/userProfile";
// import { LoginButton } from "@/components/login-header";
import { HeroNav } from "../components/hero-nav";
// import { supabase } from "@/utils/supabase/clients";

export default async function Home() {
  const {data: {user}} = await (await createClient()).auth.getUser();
  // const {data: {user} }= await supabase.auth.getUser();

  return (
    <div className="min-h-screen .bg-gradient-to-b .from-gray-50 .to-gray-100">
      {/* Header */}
        {/* <div className="absolute inset-0 bg-black/50" /> Overlay for readability */}
      <HeroNav user= {user} />
      {/* <HeroNav  /> */}

      {/* Hero Section */}
      <section className="relative flex min-h-[85vh]  items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url(/hero1.jpg)" }}>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl text-foreground font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to Jasglynn ERP
          </h1>
          <p className="mt-4 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto">
            Streamline your hospitality operations with our powerful, intuitive management system.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/restaurant" className="flex items-center gap-2">
                Manage Orders <Utensils className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link href="/dashboard" className="flex items-center gap-2">
                View Dashboard <BarChart className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">Boost Productivity</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-6 w-6 text-primary" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Effortlessly create, track, and manage customer orders in real-time.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-primary" />
                  Inventory Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Keep your stock levels optimized with automated tracking and restocking.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-6 w-6 text-primary" />
                  Seamless Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Integrate with your existing tools for a unified business experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white text-center">
        <p>&copy; 2025 Jasglynn ERP. All rights reserved.</p>
        {/* <div className="mt-4 flex justify-center gap-4">
          <Link href="/restaurant" className="hover:underline">Restaurant</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        </div> */}
      </footer>
    </div>
  );
}
