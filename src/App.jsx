import { useState, useEffect, useMemo } from 'react';
import { INITIAL_PLAN, isHighPriority, HIGH_PRIORITY_TOPICS } from './data';
import { CheckCircle2, Circle, Flame, Target, BookOpen, AlertCircle, BarChart3, CalendarDays, BrainCircuit, Activity, ChevronRight, Award } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEY = 'study_planner_progress';

const getInitialProgress = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const initial = {};
  INITIAL_PLAN.forEach(day => {
    initial[day.date] = {};
    ['morning', 'mid', 'night'].forEach(session => {
      initial[day.date][session] = {};
      day.sessions[session].topics.forEach((topic, i) => {
        initial[day.date][session][topic] = {
          studied: false,
          understood: false,
          write: false,
          confidence: 0,
        };
      });
    });
  });
  return initial;
};

export default function App() {
  const [progress, setProgress] = useState(getInitialProgress());
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('daily'); // daily, progress, analytics

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (date, session, topic, field, value) => {
    setProgress(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [session]: {
          ...prev[date][session],
          [topic]: {
            ...prev[date][session][topic],
            [field]: value
          }
        }
      }
    }));
  };

  const setConfidence = (date, session, topic, value) => {
    updateProgress(date, session, topic, 'confidence', value);
  };

  const currentDay = INITIAL_PLAN[selectedDateIndex];
  
  // Calculate carry-forward tasks
  const carryForwardTasks = useMemo(() => {
    const tasks = [];
    for (let i = 0; i < selectedDateIndex; i++) {
      const pastDay = INITIAL_PLAN[i];
      ['morning', 'mid', 'night'].forEach(session => {
        pastDay.sessions[session].topics.forEach(topic => {
          const p = progress[pastDay.date]?.[session]?.[topic];
          if (p && (!p.studied || !p.understood || !p.write)) {
            tasks.push({
              originalDate: pastDay.date,
              originalSession: session,
              subject: pastDay.sessions[session].subject,
              topic,
              status: p
            });
          }
        });
      });
    }
    return tasks;
  }, [selectedDateIndex, progress]);

  // Calculate analytics
  const analytics = useMemo(() => {
    let total = 0;
    let completed = 0;
    let weak = [];
    let currentStreak = 0;
    let tempStreak = 0;

    INITIAL_PLAN.forEach(day => {
      let dayCompleted = true;
      let dayHasTopics = false;

      ['morning', 'mid', 'night'].forEach(session => {
        day.sessions[session].topics.forEach(topic => {
          dayHasTopics = true;
          total++;
          const p = progress[day.date]?.[session]?.[topic];
          if (p && p.studied && p.understood && p.write) {
            completed++;
          } else {
            dayCompleted = false;
          }
          if (p && p.confidence > 0 && p.confidence <= 2) {
            weak.push({ date: day.date, subject: day.sessions[session].subject, topic, confidence: p.confidence });
          }
        });
      });

      if (dayHasTopics && dayCompleted) {
        tempStreak++;
        if (tempStreak > currentStreak) currentStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    return { total, completed, weak, currentStreak };
  }, [progress]);

  const renderSessionCard = (sessionName, data, date, isNight) => {
    const sessionKey = sessionName.toLowerCase();
    const isMorning = sessionKey === 'morning';
    const isMid = sessionKey === 'mid';
    
    // Add carry-forward tasks to night session
    const displayTopics = [...data.topics];
    const isCarryForward = [];
    if (isNight && carryForwardTasks.length > 0) {
      carryForwardTasks.forEach(task => {
        displayTopics.push(task.topic);
        isCarryForward.push(task);
      });
    }

    return (
      <div className={cn(
        "jarvis-panel p-6 flex flex-col relative overflow-hidden group",
      )}>
        {/* Decorative glow line */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-1",
          isMorning ? "bg-orange-500" : isMid ? "bg-yellow-500" : "bg-indigo-500"
        )} />
        
        <div className="flex items-center mb-6">
          <div className={cn(
            "p-3 rounded-lg mr-4 backdrop-blur-sm",
            isMorning ? "bg-orange-500/20 text-orange-400" : isMid ? "bg-yellow-500/20 text-yellow-400" : "bg-indigo-500/20 text-indigo-400"
          )}>
            {isMorning ? <Activity size={24} /> : isMid ? <Target size={24} /> : <BrainCircuit size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
              {sessionName} Session
            </h2>
            <p className="text-jarvis-blue text-sm">{data.subject}</p>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {displayTopics.map((topic, idx) => {
            const carryTask = isNight && idx >= data.topics.length ? isCarryForward[idx - data.topics.length] : null;
            const topicDate = carryTask ? carryTask.originalDate : date;
            const topicSession = carryTask ? carryTask.originalSession : sessionKey;
            
            const p = progress[topicDate]?.[topicSession]?.[topic] || { studied: false, understood: false, write: false, confidence: 0 };
            const isHigh = isHighPriority(topic);
            const isCompleted = p.studied && p.understood && p.write;

            return (
              <div key={`${topicDate}-${topicSession}-${topic}`} className={cn(
                "p-4 rounded-lg border transition-all duration-300",
                isCompleted ? "border-green-500/30 bg-green-900/10" : "border-jarvis-border bg-jarvis-dark/50 hover:border-jarvis-blue/50"
              )}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-medium", isCompleted ? "text-green-400" : "text-gray-200")}>
                      {topic}
                    </span>
                    {isHigh && (
                      <span className="px-2 py-0.5 text-xs rounded border border-red-500/50 bg-red-500/10 text-red-400 flex items-center gap-1 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                        <Flame size={12} /> Priority
                      </span>
                    )}
                    {carryTask && (
                      <span className="px-2 py-0.5 text-xs rounded border border-orange-500/50 bg-orange-500/10 text-orange-400 flex items-center gap-1">
                        <AlertCircle size={12} /> Carry Fwd
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer group/chk">
                    <input type="checkbox" className="checkbox-custom" checked={p.studied} 
                           onChange={(e) => updateProgress(topicDate, topicSession, topic, 'studied', e.target.checked)} />
                    <span className="text-sm text-gray-400 group-hover/chk:text-gray-200 transition-colors">Studied</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group/chk">
                    <input type="checkbox" className="checkbox-custom" checked={p.understood} 
                           onChange={(e) => updateProgress(topicDate, topicSession, topic, 'understood', e.target.checked)} />
                    <span className="text-sm text-gray-400 group-hover/chk:text-gray-200 transition-colors">Understood</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group/chk">
                    <input type="checkbox" className="checkbox-custom" checked={p.write} 
                           onChange={(e) => updateProgress(topicDate, topicSession, topic, 'write', e.target.checked)} />
                    <span className="text-sm text-gray-400 group-hover/chk:text-gray-200 transition-colors">Can Write</span>
                  </label>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Confidence</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setConfidence(topicDate, topicSession, topic, star)}
                        className={cn(
                          "w-6 h-6 rounded flex items-center justify-center text-xs transition-all",
                          p.confidence >= star 
                            ? (star <= 2 ? "bg-red-500/20 text-red-400 border border-red-500/50" : star <= 4 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : "bg-green-500/20 text-green-400 border border-green-500/50")
                            : "bg-gray-800 text-gray-600 border border-gray-700 hover:border-gray-500"
                        )}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-jarvis-dark border border-jarvis-blue rounded-full flex items-center justify-center shadow-glow animate-pulse-glow z-10 relative">
              <BrainCircuit className="text-jarvis-blue" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-white flex items-center gap-3">
              J.A.R.V.I.S <span className="text-jarvis-blue text-lg font-normal tracking-normal border-l border-jarvis-border pl-3">Study Protocol</span>
            </h1>
            <p className="text-jarvis-blue/70 text-sm tracking-wide">Exam Preparation Active // May 3 - May 17</p>
          </div>
        </div>

        <div className="flex bg-jarvis-dark/50 p-1 rounded-xl border border-jarvis-border backdrop-blur-md">
          <button onClick={() => setActiveTab('daily')} className={cn("px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all", activeTab === 'daily' ? "bg-jarvis-blue/20 text-jarvis-blue shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]" : "text-gray-400 hover:text-white")}>
            <CalendarDays size={16} /> Daily Plan
          </button>
          <button onClick={() => setActiveTab('progress')} className={cn("px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all", activeTab === 'progress' ? "bg-jarvis-blue/20 text-jarvis-blue shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]" : "text-gray-400 hover:text-white")}>
            <Activity size={16} /> Progress
          </button>
          <button onClick={() => setActiveTab('analytics')} className={cn("px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all", activeTab === 'analytics' ? "bg-jarvis-blue/20 text-jarvis-blue shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]" : "text-gray-400 hover:text-white")}>
            <BarChart3 size={16} /> Analytics
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'daily' && (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Timeline selector */}
            <div className="flex overflow-x-auto pb-4 mb-6 gap-2 snap-x scrollbar-hide">
              {INITIAL_PLAN.map((day, idx) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDateIndex(idx)}
                  className={cn(
                    "flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-all snap-start",
                    selectedDateIndex === idx 
                      ? "border-jarvis-blue bg-jarvis-blue/10 shadow-glow" 
                      : "border-jarvis-border bg-jarvis-dark/50 hover:border-gray-500"
                  )}
                >
                  <span className={cn("text-xs font-bold mb-1", selectedDateIndex === idx ? "text-jarvis-blue" : "text-gray-400")}>
                    {day.day}
                  </span>
                  <div className={cn("w-2 h-2 rounded-full", day.color)} />
                  {day.isAlert && <AlertCircle size={12} className="text-red-500 mt-1" />}
                </button>
              ))}
            </div>

            {/* Current Day Header */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className={cn("w-3 h-3 rounded-full shadow-glow", currentDay.color)}></span>
                {currentDay.day} 
              </h2>
              {currentDay.title && (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                  {currentDay.title}
                </span>
              )}
            </div>

            {/* Daily Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {renderSessionCard("Morning", currentDay.sessions.morning, currentDay.date, false)}
              {renderSessionCard("Mid", currentDay.sessions.mid, currentDay.date, false)}
              {renderSessionCard("Night", currentDay.sessions.night, currentDay.date, true)}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="jarvis-panel p-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Activity className="text-jarvis-blue" /> Full Progress Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-jarvis-border text-gray-400 text-sm">
                    <th className="p-3 font-medium uppercase tracking-wider">Day</th>
                    <th className="p-3 font-medium uppercase tracking-wider">Subject</th>
                    <th className="p-3 font-medium uppercase tracking-wider">Topic</th>
                    <th className="p-3 font-medium uppercase tracking-wider">Status</th>
                    <th className="p-3 font-medium uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jarvis-border/50">
                  {INITIAL_PLAN.map(day => 
                    ['morning', 'mid', 'night'].map(session => 
                      day.sessions[session].topics.map(topic => {
                        const p = progress[day.date]?.[session]?.[topic];
                        if (!p) return null;
                        const isCompleted = p.studied && p.understood && p.write;
                        const inProgress = p.studied || p.understood || p.write;
                        
                        return (
                          <tr key={`${day.date}-${session}-${topic}`} className="hover:bg-white/5 transition-colors group">
                            <td className="p-3 whitespace-nowrap text-sm text-gray-300">{day.day}</td>
                            <td className="p-3 whitespace-nowrap text-sm text-jarvis-blue">{day.sessions[session].subject}</td>
                            <td className="p-3 text-sm text-gray-200">
                              <span className="flex items-center gap-2">
                                {topic}
                                {isHighPriority(topic) && <Flame size={14} className="text-red-500" />}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {isCompleted ? (
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded text-xs">Completed</span>
                              ) : inProgress ? (
                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded text-xs">In Progress</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded text-xs">Not Started</span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                  <div key={i} className={cn(
                                    "w-4 h-4 rounded-full",
                                    p.confidence >= i ? "bg-jarvis-blue shadow-glow" : "bg-gray-800"
                                  )} />
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="jarvis-panel p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 uppercase text-xs tracking-wider font-bold mb-1">Total Progress</p>
                  <h3 className="text-3xl font-bold text-white">{Math.round((analytics.completed / analytics.total) * 100 || 0)}%</h3>
                  <p className="text-sm text-jarvis-blue mt-2">{analytics.completed} / {analytics.total} Topics</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-jarvis-blue/30 flex items-center justify-center relative">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="30" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-jarvis-blue" strokeDasharray={`${(analytics.completed / analytics.total) * 188 || 0} 188`} />
                  </svg>
                  <Award className="text-jarvis-blue" size={24} />
                </div>
              </div>

              <div className="jarvis-panel p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 uppercase text-xs tracking-wider font-bold mb-1">Perfect Days</p>
                  <h3 className="text-3xl font-bold text-white">{analytics.currentStreak}</h3>
                  <p className="text-sm text-green-400 mt-2">Current Streak</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <Flame className="text-green-500" size={28} />
                </div>
              </div>

              <div className="jarvis-panel p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 uppercase text-xs tracking-wider font-bold mb-1">Carry Forward</p>
                  <h3 className="text-3xl font-bold text-white">{carryForwardTasks.length}</h3>
                  <p className="text-sm text-orange-400 mt-2">Pending Topics</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                  <AlertCircle className="text-orange-500" size={28} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="jarvis-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-500" /> Weak Areas (Low Confidence)
                </h3>
                {analytics.weak.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {analytics.weak.map((w, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-jarvis-dark/50 border border-red-500/20">
                        <div>
                          <p className="text-sm font-medium text-gray-200">{w.topic}</p>
                          <p className="text-xs text-red-400">{w.subject} ({INITIAL_PLAN.find(d => d.date === w.date)?.day})</p>
                        </div>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                          Level {w.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500/50" />
                    <p>No weak areas identified yet. Rate your confidence!</p>
                  </div>
                )}
              </div>
              
              <div className="jarvis-panel p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="text-jarvis-blue" /> Priority Focus
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {HIGH_PRIORITY_TOPICS.map((topic, i) => {
                    // Check if completed
                    let isDone = false;
                    INITIAL_PLAN.forEach(day => {
                      ['morning', 'mid', 'night'].forEach(session => {
                        if (day.sessions[session].topics.includes(topic)) {
                          const p = progress[day.date]?.[session]?.[topic];
                          if (p && p.studied && p.understood && p.write) isDone = true;
                        }
                      });
                    });

                    return (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-jarvis-dark/50 border border-jarvis-border">
                        <span className="text-sm font-medium text-gray-200">{topic}</span>
                        {isDone ? (
                          <span className="text-green-400 flex items-center gap-1 text-xs"><CheckCircle2 size={14} /> Secured</span>
                        ) : (
                          <span className="text-orange-400 flex items-center gap-1 text-xs"><AlertCircle size={14} /> Pending</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
