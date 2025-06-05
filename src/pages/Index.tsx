
console.log("Index.tsx: Loading Index page...");

import React from 'react';

const Index = () => {
  console.log("Index.tsx: Rendering Index component");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">MySchool 2.0</h1>
        <p className="text-center text-gray-600 mb-8">
          Système de gestion scolaire moderne
        </p>
        <div className="flex justify-center">
          <a 
            href="/dashboard" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Accéder au tableau de bord
          </a>
        </div>
      </div>
    </div>
  );
};

console.log("Index.tsx: Component defined successfully");

export default Index;
