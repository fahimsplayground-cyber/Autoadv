import React from 'react';

const Home = () => {
  const handleLogin = async () => {
    // Call our backend to get the Discord OAuth URL
    const res = await fetch('http://localhost:5000/api/auth/login');
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-grid flex flex-col items-center justify-center p-6">
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center max-w-6xl">
        <div className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-neonCyan text-black px-2 py-1 rounded">A</span>
          <span className="text-white">Auto<span className="text-neonCyan">Advertise</span></span>
        </div>
        <button onClick={handleLogin} className="btn-primary">Login</button>
      </nav>

      <main className="text-center mt-20">
        <div className="text-xs font-bold text-neonCyan border border-neonCyan/30 rounded-full px-4 py-1 inline-block mb-6 uppercase tracking-widest">
          Quick Start • Under 5 Minutes
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          From zero to <span className="text-neonCyan text-glow">broadcasting</span> <br />
          in 5 simple steps.
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
          This guide walks you through getting access, registering your Discord account, 
          and launching your first auto-broadcast. No setup files, no installs.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button onClick={handleLogin} className="btn-primary px-8 py-4 text-xl">Get Started</button>
        </div>
      </main>
    </div>
  );
};

export default Home;
    
