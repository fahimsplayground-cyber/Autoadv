import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [tokenInput, setTokenInput] = useState('');
  // Updated to point to your actual Render Backend
  const API_BASE = "https://autoadv-kiqr.onrender.com"; 
  
  const [userId] = useState(new URLSearchParams(window.location.search).get('user_id') || 'Guest');

  // Form States for Campaign
  const [selectedAcc, setSelectedAcc] = useState('');
  const [channelId, setChannelId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId !== 'Guest') fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/accounts/list/${userId}`);
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  const addAccount = async () => {
    try {
      await axios.post(`${API_BASE}/api/accounts/add`, {
        user_id: userId,
        token: tokenInput,
        account_name: "Alt Account"
      });
      setTokenInput('');
      fetchAccounts();
    } catch (err) { alert("Invalid Token or Connection Error!"); }
  };

  const startCampaign = async () => {
    try {
      await axios.post(`${API_BASE}/api/campaign/start`, {
        account_id: selectedAcc,
        channel_id: channelId,
        message: message,
        interval_minutes: 10,
        purge_after_minutes: 30
      });
      alert("Campaign Started!");
    } catch (err) {
      alert("Failed to start campaign. Check if Backend is awake.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Control <span className="text-[#00f2ff]">Panel</span></h1>
          <div className="text-gray-400">User ID: {userId}</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Register Section */}
          <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
            <h2 className="text-[#00f2ff] font-bold mb-4 uppercase text-sm tracking-widest">Register Account</h2>
            <input 
              className="w-full bg-black border border-white/10 p-3 rounded mb-4 outline-none focus:border-[#00f2ff]"
              placeholder="Paste Discord Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button onClick={addAccount} className="w-full bg-[#00f2ff] text-black font-bold py-2 rounded hover:bg-white transition">Validate & Register</button>
          </div>

          {/* Campaign Section */}
          <div className="bg-[#111] border border-white/10 p-6 rounded-xl md:col-span-2">
            <h2 className="text-[#00f2ff] font-bold mb-4 uppercase text-sm tracking-widest">Launch Broadcast</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select 
                onChange={(e) => setSelectedAcc(e.target.value)}
                className="bg-black border border-white/10 p-3 rounded text-gray-400">
                <option>Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name}</option>)}
              </select>
              <input 
                placeholder="Channel ID" 
                className="bg-black border border-white/10 p-3 rounded outline-none"
                onChange={(e) => setChannelId(e.target.value)}
              />
            </div>
            <textarea 
              placeholder="Your Advertisement Message..."
              className="w-full bg-black border border-white/10 p-3 rounded h-24 mb-4 outline-none"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={startCampaign} className="w-full bg-[#00f2ff] text-black font-bold py-3 rounded hover:bg-white transition">Start Auto-Broadcast</button>
          </div>

          {/* Status Section */}
          <div className="bg-[#111] border border-white/10 p-6 rounded-xl md:col-span-3">
            <h2 className="text-[#00f2ff] font-bold mb-4 uppercase text-sm tracking-widest">Active Accounts</h2>
            <div className="flex gap-4 overflow-x-auto">
              {accounts.length > 0 ? accounts.map(acc => (
                <div key={acc.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center gap-3 min-w-[200px]">
                  <div className={`w-3 h-3 rounded-full ${acc.status === 'live' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{acc.account_name}</span>
                </div>
              )) : <p className="text-gray-500">No accounts registered yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
                            
