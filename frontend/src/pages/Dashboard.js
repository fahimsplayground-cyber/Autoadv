import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [tokenInput, setTokenInput] = useState('');
  const [userId] = useState(new URLSearchParams(window.location.search).get('user_id'));

  // Form States for Campaign
  const [selectedAcc, setSelectedAcc] = useState('');
  const [channelId, setChannelId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId) fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    const res = await axios.get(`http://localhost:5000/api/accounts/list/${userId}`);
    setAccounts(res.data);
  };

  const addAccount = async () => {
    try {
      await axios.post('http://localhost:5000/api/accounts/add', {
        user_id: userId,
        token: tokenInput,
        account_name: "Alt Account"
      });
      setTokenInput('');
      fetchAccounts();
    } catch (err) { alert("Invalid Token!"); }
  };

  const startCampaign = async () => {
    await axios.post('http://localhost:5000/api/campaign/start', {
      account_id: selectedAcc,
      channel_id: channelId,
      message: message,
      interval_minutes: 10,
      purge_after_minutes: 30
    });
    alert("Campaign Started!");
  };

  return (
    <div className="min-h-screen bg-darkBg bg-grid p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-glow">Control <span className="text-neonCyan">Panel</span></h1>
          <div className="text-gray-400">User ID: {userId}</div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Section 1: Add Account */}
          <div className="bento-card p-6 md:col-span-1">
            <h2 className="text-neonCyan font-bold mb-4 uppercase text-sm tracking-widest">Register Account</h2>
            <input 
              className="w-full bg-black border border-white/10 p-3 rounded mb-4 focus:border-neonCyan outline-none"
              placeholder="Paste Discord Token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button onClick={addAccount} className="btn-primary w-full text-sm">Validate & Register</button>
          </div>

          {/* Section 2: Campaign Setup */}
          <div className="bento-card p-6 md:col-span-2">
            <h2 className="text-neonCyan font-bold mb-4 uppercase text-sm tracking-widest">Launch Broadcast</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select 
                onChange={(e) => setSelectedAcc(e.target.value)}
                className="bg-black border border-white/10 p-3 rounded text-gray-400">
                <option>Select Account</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.account_name}</option>)}
              </select>
              <input 
                placeholder="Channel ID" 
                className="bg-black border border-white/10 p-3 rounded"
                onChange={(e) => setChannelId(e.target.value)}
              />
            </div>
            <textarea 
              placeholder="Your Advertisement Message..."
              className="w-full bg-black border border-white/10 p-3 rounded h-24 mb-4"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={startCampaign} className="btn-primary w-full">Start Auto-Broadcast</button>
          </div>

          {/* Section 3: Status / Logs */}
          <div className="bento-card p-6 md:col-span-3">
            <h2 className="text-neonCyan font-bold mb-4 uppercase text-sm tracking-widest">Active Accounts</h2>
            <div className="flex gap-4 overflow-x-auto">
              {accounts.map(acc => (
                <div key={acc.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center gap-3 min-w-[200px]">
                  <div className={`w-3 h-3 rounded-full ${acc.status === 'live' ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-red-500'}`}></div>
                  <span>{acc.account_name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
          
