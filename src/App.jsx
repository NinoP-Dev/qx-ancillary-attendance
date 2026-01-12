import React, { useState, useEffect, useRef } from 'react';
import { Clock, LogIn, TreePine, Leaf, Users, Calendar, Download, Sparkles, UserPlus, UserMinus, X, Check } from 'lucide-react';

const DEFAULT_COLLEAGUES = ['Andrew', 'Simon', 'Tony'];

const App = () => {
  // Lazy initialization: load logs directly from localStorage when state is created
  // This ensures data is available immediately and won't be overwritten
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = localStorage.getItem('forest_logs_static');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        console.log('Loaded logs from localStorage:', parsed.length, 'entries');
        return parsed;
      }
    } catch (error) {
      console.error('Error loading logs from localStorage:', error);
    }
    return [];
  });

  // Load colleagues from localStorage, fallback to defaults
  const [colleagues, setColleagues] = useState(() => {
    try {
      const savedColleagues = localStorage.getItem('forest_colleagues');
      if (savedColleagues) {
        const parsed = JSON.parse(savedColleagues);
        console.log('Loaded colleagues from localStorage:', parsed.length, 'members');
        return parsed;
      }
    } catch (error) {
      console.error('Error loading colleagues from localStorage:', error);
    }
    return DEFAULT_COLLEAGUES;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  // Using Lorem Picsum with forest/nature seeds for lush green backgrounds
  const [bgImage, setBgImage] = useState('https://picsum.photos/seed/forest1/2560/1440');

  // Colleague management state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColleagueName, setNewColleagueName] = useState('');
  const [colleagueToRemove, setColleagueToRemove] = useState(null);

  // Track if initial load is complete to avoid saving empty array on mount
  const isInitialMount = useRef(true);
  const isColleaguesInitialMount = useRef(true);

  useEffect(() => {
    // Use forest/green themed seeds for more nature-like images
    const greenSeeds = ['forest', 'trees', 'leaves', 'jungle', 'garden', 'fern', 'moss', 'bamboo', 'meadow', 'woodland'];
    const randomSeed = greenSeeds[Math.floor(Math.random() * greenSeeds.length)];
    const randomNum = Math.floor(Math.random() * 50);
    setBgImage(`https://picsum.photos/seed/${randomSeed}${randomNum}/2560/1440`);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save logs to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem('forest_logs_static', JSON.stringify(logs));
      console.log('Saved logs to localStorage:', logs.length, 'entries');
    } catch (error) {
      console.error('Error saving logs to localStorage:', error);
    }
  }, [logs]);

  // Save colleagues to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (isColleaguesInitialMount.current) {
      isColleaguesInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem('forest_colleagues', JSON.stringify(colleagues));
      console.log('Saved colleagues to localStorage:', colleagues.length, 'members');
    } catch (error) {
      console.error('Error saving colleagues to localStorage:', error);
    }
  }, [colleagues]);

  // Check if colleague has already clocked in today
  const hasClockedInToday = (name) => {
    const today = new Date().toLocaleDateString();
    return logs.some(l => l.name === name && l.date === today);
  };

  const handleClockIn = (name) => {
    if (hasClockedInToday(name)) return; // Already clocked in today

    const now = new Date();
    const newLog = {
      id: crypto.randomUUID(),
      name,
      date: now.toLocaleDateString(),
      inTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLogs([...logs, newLog]);
  };

  const handleAddColleague = () => {
    const trimmedName = newColleagueName.trim();
    if (!trimmedName) return;
    if (colleagues.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
      alert('This colleague already exists!');
      return;
    }
    setColleagues([...colleagues, trimmedName]);
    setNewColleagueName('');
    setShowAddForm(false);
  };

  const handleRemoveColleague = (name) => {
    // Remove colleague from the list (logs are preserved)
    setColleagues(colleagues.filter(c => c !== name));
    setColleagueToRemove(null);
  };

  const exportToCSV = () => {
    const headers = ["Date", "Colleague", "Clock In"];
    const rows = logs.map(l => [l.date, l.name, l.inTime]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `forest_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950 text-white font-sans selection:bg-lime-400/30">
      {/* Lush green background with nature overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: '#052e16'
        }}
      >
        {/* Green-tinted gradient overlay for that forest canopy feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-green-900/40 to-emerald-950/90" />
        {/* Subtle green ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-lime-500/5 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative p-4 md:p-8 pt-12 md:pt-20 z-10">
        {/* Floating leaf decorations */}
        <div className="fixed top-20 left-10 opacity-10 animate-pulse">
          <Leaf className="w-24 h-24 text-lime-400 rotate-12" />
        </div>
        <div className="fixed bottom-20 right-10 opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>
          <Leaf className="w-32 h-32 text-emerald-400 -rotate-45" />
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500/30 to-lime-500/20 rounded-3xl border border-lime-400/30 backdrop-blur-2xl shadow-2xl shadow-emerald-500/10">
              <TreePine className="w-10 h-10 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                Forest Log
              </h1>
              <div className="flex items-center gap-3 mt-1 text-lime-300/80 font-medium">
                <Calendar className="w-4 h-4" />
                {currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                <Sparkles className="w-3 h-3 text-lime-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/30 backdrop-blur-3xl border border-lime-500/20 px-8 py-4 rounded-3xl shadow-2xl shadow-emerald-500/10 flex items-center gap-6 group hover:border-lime-400/40 transition-all hover:shadow-lime-500/20">
            <Clock className="w-6 h-6 text-lime-400 group-hover:rotate-12 transition-transform drop-shadow-[0_0_6px_rgba(163,230,53,0.4)]" />
            <span className="text-3xl font-mono font-bold tracking-widest bg-gradient-to-r from-lime-200 to-emerald-200 bg-clip-text text-transparent">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Colleague Management Section */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-lime-600/40 to-emerald-600/30 hover:from-lime-500/50 hover:to-emerald-500/40 rounded-xl text-sm font-bold transition-all border border-lime-500/30 hover:border-lime-400/50 active:scale-95 text-lime-300"
          >
            <UserPlus className="w-4 h-4" /> Add Colleague
          </button>

          {showAddForm && (
            <div className="flex items-center gap-2 bg-emerald-900/50 backdrop-blur-xl p-2 rounded-xl border border-lime-500/30">
              <input
                type="text"
                value={newColleagueName}
                onChange={(e) => setNewColleagueName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColleague()}
                placeholder="Enter name..."
                className="px-4 py-2 bg-emerald-950/50 rounded-lg border border-emerald-500/30 text-emerald-100 placeholder-emerald-500/50 focus:outline-none focus:border-lime-500/50 w-40"
                autoFocus
              />
              <button
                onClick={handleAddColleague}
                className="p-2 bg-lime-500/30 hover:bg-lime-500/50 rounded-lg transition-all text-lime-300"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewColleagueName(''); }}
                className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-all text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {colleagues.map((name) => {
            const clockedIn = hasClockedInToday(name);
            return (
              <div
                key={name}
                className={`relative overflow-hidden transition-all duration-500 p-8 rounded-[2.5rem] border ${clockedIn
                  ? 'bg-gradient-to-br from-emerald-900/70 to-lime-900/50 border-lime-400/50 shadow-[0_0_50px_rgba(163,230,53,0.15)]'
                  : 'bg-gradient-to-br from-green-950/50 to-emerald-950/30 border-emerald-500/20 hover:border-lime-500/40 hover:shadow-emerald-500/10'
                  } backdrop-blur-3xl group hover:shadow-2xl`}
              >
                {/* Remove colleague button */}
                <button
                  onClick={() => setColleagueToRemove(name)}
                  className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-all text-red-300 z-20"
                  title="Remove colleague"
                >
                  <UserMinus className="w-4 h-4" />
                </button>

                {/* Confirmation overlay for removal */}
                {colleagueToRemove === name && (
                  <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md rounded-[2.5rem] flex flex-col items-center justify-center z-30 p-6">
                    <p className="text-emerald-100 font-bold text-center mb-2">Remove {name}?</p>
                    <p className="text-emerald-400/70 text-sm text-center mb-6">Their log history will be preserved.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRemoveColleague(name)}
                        className="px-4 py-2 bg-red-500/40 hover:bg-red-500/60 rounded-lg text-red-200 font-bold transition-all"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setColleagueToRemove(null)}
                        className="px-4 py-2 bg-emerald-500/30 hover:bg-emerald-500/50 rounded-lg text-emerald-200 font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Decorative leaf */}
                <div className="absolute top-0 right-0 p-6 opacity-15 group-hover:opacity-30 transition-opacity">
                  <Leaf className={`w-16 h-16 ${clockedIn ? 'text-lime-400 rotate-45' : 'text-emerald-500'}`} />
                </div>
                {/* Subtle glow effect */}
                <div className={`absolute inset-0 rounded-[2.5rem] ${clockedIn ? 'bg-gradient-to-t from-lime-500/5 to-transparent' : ''}`} />

                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 mb-4 transition-all group-hover:scale-110 shadow-xl ${clockedIn
                    ? 'bg-gradient-to-br from-lime-400 to-emerald-500 text-emerald-950 border-lime-300 shadow-lime-500/30'
                    : 'bg-gradient-to-br from-emerald-800/50 to-green-900/50 text-emerald-300 border-emerald-500/30'
                    }`}>
                    {name[0]}
                  </div>
                  <h3 className="text-2xl font-bold mb-1 text-emerald-50">{name}</h3>
                  <div className={`text-xs uppercase tracking-[0.3em] font-black mb-8 flex items-center gap-2 ${clockedIn ? 'text-lime-400' : 'text-emerald-500/60'}`}>
                    {clockedIn && <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(163,230,53,0.6)]" />}
                    {clockedIn ? 'Present Today' : 'Not Clocked In'}
                  </div>

                  <button
                    onClick={() => handleClockIn(name)}
                    disabled={clockedIn}
                    className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all active:scale-95 shadow-lg ${clockedIn
                      ? 'bg-emerald-800/30 text-lime-500/50 border border-lime-500/20 cursor-not-allowed'
                      : 'bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-emerald-950 shadow-lime-500/20'
                      }`}
                  >
                    <LogIn className="w-5 h-5" />
                    {clockedIn ? 'Already Clocked In' : 'Clock In'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-emerald-950/60 to-green-950/40 backdrop-blur-3xl border border-emerald-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/30 mb-12">
          <div className="p-8 border-b border-emerald-500/10 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-r from-lime-500/5 via-transparent to-emerald-500/5">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-lime-500/30 to-emerald-500/20 rounded-lg border border-lime-500/20">
                <Users className="w-6 h-6 text-lime-400 drop-shadow-[0_0_4px_rgba(163,230,53,0.4)]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-emerald-100">Attendance Ledger</h2>
              <Leaf className="w-4 h-4 text-lime-500/50 rotate-45" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-800/50 to-green-800/30 hover:from-emerald-700/60 hover:to-green-700/40 rounded-xl text-sm font-bold transition-all border border-emerald-500/20 hover:border-lime-500/30 active:scale-95 text-lime-300"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-lime-500/50 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6 border-b border-emerald-500/10">Date</th>
                  <th className="px-8 py-6 border-b border-emerald-500/10">Colleague</th>
                  <th className="px-8 py-6 border-b border-emerald-500/10">Clock In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/5">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-emerald-600/40">
                        <TreePine className="w-12 h-12" />
                        <p className="text-lg font-medium">The forest is quiet today...</p>
                        <p className="text-sm">Clock in to start tracking attendance 🌿</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  [...logs].reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-lime-500/5 transition-colors group">
                      <td className="px-8 py-5 text-sm font-mono text-emerald-400/60">{log.date}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_8px] shadow-lime-500/50" />
                          <span className="font-bold text-emerald-100 text-lg">{log.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-lime-400 font-mono font-bold bg-lime-500/10 px-3 py-1.5 rounded-lg border border-lime-500/20">
                          {log.inTime}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-gradient-to-r from-emerald-950/60 via-green-950/40 to-emerald-950/60 text-center border-t border-emerald-500/10">
            <p className="text-[10px] text-lime-500/30 font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3">
              <Leaf className="w-3 h-3" />
              Nature Time Tracker • Daily Attendance
              <Leaf className="w-3 h-3 rotate-180" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;