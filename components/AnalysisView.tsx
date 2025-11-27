import React from 'react';
import { AIAnalysisResult, UserProfile } from '../types';
import { Sparkles, Lock } from 'lucide-react';

interface AnalysisViewProps {
  user: UserProfile;
  result: AIAnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  user, 
  result, 
  loading, 
  onAnalyze,
  canAnalyze 
}) => {

  if (!user.isSetup) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
        <div className="bg-stone-200 p-4 rounded-full">
            <Lock size={32} className="text-stone-500" />
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-700">未设置八字信息</h3>
        <p className="text-stone-500 text-sm">请先在右上角个人设置中完善您的出生信息，以便AI为您进行命理推演。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
       <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-serif text-ink-black">智能命理分析</h2>
            <p className="text-xs text-stone-500">基于您的八字 ({user.birthDate}) 与今日能量场</p>
       </div>

      {!result && !loading && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 text-center">
            <p className="text-stone-600 mb-6">点击下方按钮，结合今日黄历与您的日常记录，生成今日运势深度解读。</p>
            <button
                onClick={onAnalyze}
                disabled={!canAnalyze}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold tracking-wider transition-all shadow-lg ${
                    canAnalyze 
                    ? 'bg-gradient-to-r from-stone-800 to-stone-900 hover:shadow-xl transform hover:-translate-y-1' 
                    : 'bg-stone-300 cursor-not-allowed'
                }`}
            >
                <Sparkles size={20} />
                <span>{canAnalyze ? '开始推演' : '请先填写今日记录'}</span>
            </button>
            {!canAnalyze && <p className="text-xs text-red-400 mt-2">请至少填写一项日常记录（情绪、财务等）</p>}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="w-12 h-12 border-4 border-cinnabar-red border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-500 animate-pulse font-serif">正在排盘推演中...</p>
        </div>
      )}

      {result && !loading && (
        <div className="animate-fade-in space-y-6">
            {/* Score Card */}
            <div className="bg-stone-800 text-paper-white rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles size={100} />
                 </div>
                 <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">今日运势指数</div>
                        <div className="text-5xl font-serif font-bold text-amber-500">{result.overallScore}</div>
                    </div>
                    <div className="text-right max-w-[50%]">
                        <p className="text-sm text-stone-300 italic">"{result.advice.slice(0, 20)}..."</p>
                    </div>
                 </div>
            </div>

            {/* Analysis Detail */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <h3 className="text-lg font-serif font-bold text-ink-black mb-4 border-b border-stone-100 pb-2">命理格局分析</h3>
                <p className="text-stone-600 leading-relaxed text-sm text-justify whitespace-pre-wrap">
                    {result.baziAnalysis}
                </p>
            </div>

             {/* Actionable Advice */}
             <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl p-6 shadow-sm border border-amber-100">
                <h3 className="text-lg font-serif font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span>生活建议</span>
                </h3>
                <p className="text-stone-700 leading-relaxed text-sm text-justify whitespace-pre-wrap">
                    {result.advice}
                </p>
            </div>
        </div>
      )}
    </div>
  );
};