import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AlmanacCard } from './components/AlmanacCard';
import { JournalForm } from './components/JournalForm';
import { AnalysisView } from './components/AnalysisView';
import { SettingsModal } from './components/SettingsModal';
import { ViewState, UserProfile, JournalEntry, AlmanacData, AIAnalysisResult } from './types';
import { fetchDailyAlmanac, generatePersonalAnalysis } from './services/geminiService';

const DEFAULT_USER: UserProfile = {
  name: '',
  birthDate: '',
  birthTime: '',
  isSetup: false
};

const DEFAULT_ENTRY: JournalEntry = {
  id: '',
  date: new Date().toISOString().split('T')[0],
  mood: 3,
  moodNote: '',
  relationships: '',
  financeIncome: 0,
  financeExpense: 0,
  financeNote: '',
  healthStatus: 'Fair',
  healthNote: '',
  otherEvents: ''
};

function App() {
  // State
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [journalEntry, setJournalEntry] = useState<JournalEntry>(DEFAULT_ENTRY);
  const [almanac, setAlmanac] = useState<AlmanacData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  
  // UI State
  const [loadingAlmanac, setLoadingAlmanac] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize Data
  useEffect(() => {
    // Load local storage
    const storedUser = localStorage.getItem('zenday_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const todayStr = new Date().toISOString().split('T')[0];
    const storedEntry = localStorage.getItem(`zenday_journal_${todayStr}`);
    if (storedEntry) {
      setJournalEntry(JSON.parse(storedEntry));
    } else {
      setJournalEntry(prev => ({ ...prev, date: todayStr }));
    }

    const storedAnalysis = localStorage.getItem(`zenday_analysis_${todayStr}`);
    if (storedAnalysis) setAnalysis(JSON.parse(storedAnalysis));

    // Fetch Almanac
    const fetchAlmanac = async () => {
      // Check cache first
      const cachedAlmanac = localStorage.getItem(`zenday_almanac_${todayStr}`);
      if (cachedAlmanac) {
        setAlmanac(JSON.parse(cachedAlmanac));
        return;
      }

      setLoadingAlmanac(true);
      try {
        const data = await fetchDailyAlmanac(new Date());
        setAlmanac(data);
        localStorage.setItem(`zenday_almanac_${todayStr}`, JSON.stringify(data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAlmanac(false);
      }
    };

    fetchAlmanac();
  }, []);

  // Handlers
  const handleUserSave = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('zenday_user', JSON.stringify(newUser));
  };

  const handleJournalChange = (field: keyof JournalEntry, value: any) => {
    const updated = { ...journalEntry, [field]: value };
    setJournalEntry(updated);
    localStorage.setItem(`zenday_journal_${journalEntry.date}`, JSON.stringify(updated));
  };

  const handleAnalysis = async () => {
    if (!almanac || !user.isSetup) return;
    
    setLoadingAnalysis(true);
    try {
      const result = await generatePersonalAnalysis(user, new Date(), journalEntry, almanac);
      setAnalysis(result);
      localStorage.setItem(`zenday_analysis_${journalEntry.date}`, JSON.stringify(result));
    } catch (e) {
      console.error(e);
      alert("无法生成分析，请稍后再试。");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const navigateTo = (newView: ViewState) => {
    if (newView === ViewState.SETTINGS) {
      setIsSettingsOpen(true);
    } else {
      setView(newView);
    }
  };

  // Condition to allow analysis
  const hasJournalData = journalEntry.moodNote.length > 0 || journalEntry.otherEvents.length > 0 || journalEntry.financeNote.length > 0;

  return (
    <Layout currentView={view} onNavigate={navigateTo}>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onSave={handleUserSave}
      />

      {/* Views */}
      {view === ViewState.HOME && (
        <div className="space-y-6 animate-fade-in">
          <header className="mb-4">
             <p className="text-stone-500 font-serif italic text-sm">
               你好, {user.name || '旅人'}。
             </p>
             <h2 className="text-2xl font-bold text-ink-black mt-1">
               {loadingAlmanac ? '...' : almanac?.date}
             </h2>
          </header>
          
          <AlmanacCard data={almanac} loading={loadingAlmanac} />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={() => setView(ViewState.JOURNAL)}
              className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col gap-2 hover:bg-stone-50 transition-colors"
            >
              <span className="text-2xl">✍️</span>
              <span className="font-bold text-stone-700">记录日常</span>
              <span className="text-xs text-stone-400">Mood & Events</span>
            </button>
             <button 
              onClick={() => setView(ViewState.ANALYSIS)}
              className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col gap-2 hover:bg-stone-50 transition-colors"
            >
              <span className="text-2xl">🔮</span>
              <span className="font-bold text-stone-700">AI 解读</span>
              <span className="text-xs text-stone-400">Bazi Analysis</span>
            </button>
          </div>
          
          {user.isSetup && (
             <div className="mt-8 bg-stone-100 rounded-lg p-4 text-center">
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Your Bazi Ref</p>
                <p className="text-sm font-serif text-stone-600">{user.birthDate} {user.birthTime}</p>
             </div>
          )}
        </div>
      )}

      {view === ViewState.JOURNAL && (
        <JournalForm entry={journalEntry} onChange={handleJournalChange} />
      )}

      {view === ViewState.ANALYSIS && (
        <AnalysisView 
          user={user} 
          result={analysis} 
          loading={loadingAnalysis} 
          onAnalyze={handleAnalysis}
          canAnalyze={hasJournalData}
        />
      )}

    </Layout>
  );
}

export default App;