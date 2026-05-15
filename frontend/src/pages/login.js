import React from 'react';

const Login = () => {
  const handleDiscordLogin = async () => {
    try {
      // Fetch the OAuth URL from your Render/Local backend
      const response = await fetch('http://localhost:5000/api/auth/login');
      const data = await response.json();
      
      // Redirect the user to Discord's authorization page
      window.location.href = data.url;
    } catch (error) {
      console.error("Login failed:", error);
      alert("System Offline: Could not connect to Auth Server.");
    }
  };

  return (
    <div className="min-h-screen bg-darkBg bg-grid flex items-center justify-center p-6">
      {/* Glow Effect behind the card */}
      <div className="absolute w-64 h-64 bg-neonPurple/20 blur-[100px] rounded-full"></div>
      
      <div className="bento-card p-10 max-w-md w-full text-center relative z-10">
        <div className="mb-8">
          <div className="inline-block bg-neonCyan text-black font-black px-3 py-1 rounded mb-4 shadow-[0_0_15px_#00f2fe]">
            V1.0
          </div>
          <h1 className="text-4xl font-bold tracking-tighter">
            Access <span className="text-neonCyan text-glow">Portal</span>
          </h1>
          <p className="text-gray-400 mt-2">Identify yourself to enter the dashboard.</p>
        </div>

        <button 
          onClick={handleDiscordLogin}
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg group"
        >
          <svg 
            className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" 
            viewBox="0 0 24 24"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Authorize with Discord
        </button>

        <div className="mt-6 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
          <span>Secure AES-256</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span>Educational Use Only</span>
        </div>
      </div>

      <footer className="fixed bottom-6 text-gray-600 text-xs">
        &copy; 2026 AutoAdvertise System • Built for the Community
      </footer>
    </div>
  );
};

export default Login;
    
