import React from 'react';
import { User, BookOpen, Settings, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const navItemClass = (view: ViewState) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      currentView === view ? 'text-cinnabar-red' : 'text-stone-400 hover:text-stone-600'
    }`;

  return (
    <div className="min-h-screen bg-paper-white flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-stone-200">
      {/* Header */}
      <header className="px-6 py-4 bg-paper-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-stone-200 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-widest text-ink-black flex items-center gap-2">
          <span className="bg-cinnabar-red text-white w-8 h-8 flex items-center justify-center rounded-md font-serif">禅</span>
          <span>ZenDay</span>
        </h1>
        <button 
          onClick={() => onNavigate(ViewState.SETTINGS)}
          className="p-2 text-stone-500 hover:text-ink-black transition-colors"
        >
          <User size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-white border-t border-stone-200 fixed bottom-0 w-full max-w-md z-30 px-6">
        <div className="flex justify-between items-center h-full">
          <button onClick={() => onNavigate(ViewState.HOME)} className={navItemClass(ViewState.HOME)}>
            <BookOpen size={24} />
            <span className="text-xs">今日</span>
          </button>
          
          <button onClick={() => onNavigate(ViewState.JOURNAL)} className={navItemClass(ViewState.JOURNAL)}>
            <div className={`p-3 rounded-full -mt-8 shadow-lg border-4 border-paper-white ${currentView === ViewState.JOURNAL ? 'bg-cinnabar-red text-white' : 'bg-stone-800 text-white'}`}>
              <Sparkles size={24} />
            </div>
            <span className="text-xs font-medium">记录</span>
          </button>
          
          <button onClick={() => onNavigate(ViewState.ANALYSIS)} className={navItemClass(ViewState.ANALYSIS)}>
            <Sparkles size={24} />
            <span className="text-xs">解读</span>
          </button>
        </div>
      </nav>
    </div>
  );
};