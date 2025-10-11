"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Enhanced color palette for beautiful UI:
// Primary: #6366f1 (Modern purple)
// Secondary: #8b5cf6 (Light purple)
// Accent: #f59e0b (Warm orange)
// Background: #f8fafc (Light gray)
// Dark: #1e293b (Dark slate)

const generateRestaurants = () => {
  const cuisineTypes = [
    "Indian", "Italian", "Chinese", "Mexican", "Japanese", "Thai", "American", "Mediterranean",
    "French", "Korean", "Vietnamese", "Greek", "Turkish", "Lebanese", "Spanish", "German"
  ];
  
  const restaurantNames = [
    "Spice Garden", "Pizza Corner", "Burger Hub", "Sushi Master", "Taco Fiesta", "Pasta Palace",
    "Golden Dragon", "Mumbai Express", "Bella Vista", "Ocean Breeze", "Mountain View", "Sunset Grill",
    "Royal Kitchen", "Garden Fresh", "Urban Eats", "Coastal Cuisine", "Metro Diner", "Plaza Bistro",
    "Heritage House", "Modern Meal", "Fresh & Fast", "Gourmet Gallery", "Taste Hub", "Flavor Town",
    "Dining Delight", "Culinary Corner", "Food Factory", "Meal Master", "Bite Bliss", "Savory Stop",
    "Delish Diner", "Feast Factory", "Yummy Yard", "Tasty Treats", "Food Paradise", "Kitchen King",
    "Chef's Choice", "Dining Dreams", "Food Fusion", "Taste Treasures"
  ];

  const restaurants = [];
  for (let i = 1; i <= 40; i++) {
    const randomName = restaurantNames[Math.floor(Math.random() * restaurantNames.length)];
    const randomCuisine1 = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
    const randomCuisine2 = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1); // Rating between 3.5 and 5.0
    const deliveryTime = Math.floor(Math.random() * 30 + 20); // Between 20-50 minutes
    
    restaurants.push({
      id: i,
      name: `${randomName} ${i}`,
      cuisine: `${randomCuisine1}, ${randomCuisine2}`,
      rating: parseFloat(rating),
      deliveryTime: `${deliveryTime}-${deliveryTime + 15} min`,
      image: `/api/placeholder/300/200`,
      featured: Math.random() > 0.7 // 30% chance of being featured
    });
  }
  return restaurants;
};

const restaurants = generateRestaurants();

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAppDownload, setShowAppDownload] = useState(true);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  🍽️ DabbaWala
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50">
                  Restaurants
                </a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50">
                  About
                </a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50">
                  Contact
                </a>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-indigo-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Floating food icons */}
          <div className="absolute top-20 right-1/4 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🍕</div>
          <div className="absolute top-40 left-1/4 text-3xl opacity-10 animate-bounce" style={{ animationDelay: '2s' }}>🍔</div>
          <div className="absolute bottom-40 right-1/3 text-3xl opacity-10 animate-bounce" style={{ animationDelay: '3s' }}>🍜</div>
          <div className="absolute bottom-20 left-1/5 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '4s' }}>🥗</div>
          <div className="absolute top-32 right-1/5 text-2xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🍰</div>
          
          {/* Geometric shapes */}
          <div className="absolute top-1/4 left-1/6 w-4 h-4 bg-indigo-300 rotate-45 opacity-20 animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/3 right-1/6 w-6 h-6 bg-purple-300 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-pink-300 opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Delicious Food
              <span className="block">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-600 leading-relaxed">
              Order from your favorite restaurants and get fresh, hot meals delivered right to your doorstep
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-5 border border-gray-200 rounded-2xl text-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 hover:-translate-y-1">
                <span className="flex items-center justify-center gap-2">
                  Order Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="px-10 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold text-lg rounded-2xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Restaurants */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              All Restaurants
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing restaurants in your area with fast delivery and great food
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRestaurants.map((restaurant, index) => (
              <div 
                key={restaurant.id}
                className="group animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                }}
              >
                <Link href={`/${restaurant.id}`}>
                  <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:scale-[1.02] hover:-translate-y-2 cursor-pointer group">
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-2 left-4 w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="absolute top-6 right-8 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="absolute bottom-8 left-6 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>

                    {/* Restaurant Image */}
                    <div className="relative h-40 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/15"></div>
                      {/* Animated background shapes */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" style={{ transitionDelay: '0.1s' }}></div>
                      
                      <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        🍽️
                      </div>
                      {restaurant.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            ⭐ Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {restaurant.cuisine}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-lg border border-green-100">
                            <span className="text-green-600 text-xs">⭐</span>
                            <span className="font-semibold text-green-700 text-xs">
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium">
                            {restaurant.deliveryTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover gradient border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" style={{ padding: '2px' }}>
                      <div className="w-full h-full bg-white rounded-2xl"></div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 animate-bounce">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose DabbaWala?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best food delivery service in the city with unmatched quality and speed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors">
                Fast Delivery
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get your food delivered in 30 minutes or less from your favorite restaurants with our lightning-fast delivery network
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">
                Quality Food
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fresh ingredients and carefully prepared meals from trusted restaurant partners who maintain the highest standards
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-pink-600 transition-colors">
                Easy Ordering
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Simple and intuitive ordering process with real-time tracking, live updates, and seamless payment options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                🍽️ DabbaWala
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Your favorite food delivery service bringing delicious meals right to your doorstep. Experience the fastest and most reliable food delivery in the city.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-indigo-600 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-indigo-600 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-indigo-600 transition-all duration-300">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Restaurants</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Careers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Help Center</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Track Order</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex items-center group">
                    <span className="group-hover:translate-x-1 transition-transform duration-200">Terms of Service</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Call Us</p>
                  <p className="font-semibold">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email Us</p>
                  <p className="font-semibold">support@dabbawala.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Visit Us</p>
                  <p className="font-semibold">123 Food Street, City</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 DabbaWala. All rights reserved. Made with ❤️ for food lovers.
              </p>
              <div className="mt-4 md:mt-0">
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                    Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* App Download Popup */}
      {showAppDownload && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-sm transform transition-all duration-300 hover:scale-105">
            {/* Close button */}
            <button
              onClick={() => setShowAppDownload(false)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Floating elements */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            {/* Content */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-3 animate-bounce">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Get Our App!
              </h3>
              <p className="text-sm text-gray-600">
                Order faster with our mobile app. Get exclusive deals & faster delivery!
              </p>
            </div>

            {/* Download buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Download on the</div>
                  <div className="text-sm font-semibold -mt-1">App Store</div>
                </div>
              </button>

              <button className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.633 12l2.065-2.491zM3.334 2.973L14.27 9.306 11.97 11.607 3.334 2.973z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Get it on</div>
                  <div className="text-sm font-semibold -mt-1">Google Play</div>
                </div>
              </button>
            </div>

            {/* Discount badge */}
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                🎉 50% OFF First Order
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
}
