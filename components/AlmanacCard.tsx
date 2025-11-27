import React from 'react';
import { AlmanacData } from '../types';
import { Cloud, Sun, Wind } from 'lucide-react';

interface AlmanacCardProps {
  data: AlmanacData | null;
  loading: boolean;
}

export const AlmanacCard: React.FC<AlmanacCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="w-full h-64 bg-stone-100 animate-pulse rounded-2xl flex items-center justify-center">
        <span className="text-stone-400 font-serif">推演天机中...</span>
      </div>
    );
  }

  if (!data) return null;

  const today = new Date(data.date);
  const dayNum = today.getDate();
  const weekDay = today.toLocaleDateString('zh-CN', { weekday: 'long' });
  const monthStr = today.toLocaleDateString('zh-CN', { month: 'long' });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-stone-50 rounded-full opacity-50 z-0 group-hover:scale-110 transition-transform duration-700"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-stone-500 text-sm font-medium tracking-widest uppercase">{monthStr}</div>
            <div className="text-6xl font-serif text-ink-black font-bold -ml-1 my-1">{dayNum}</div>
            <div className="text-cinnabar-red font-medium">{weekDay}</div>
          </div>
          <div className="text-right">
            <div className="bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-stone-600 inline-block mb-2">
              {data.solarTerm || '平日'}
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="text-sm text-stone-800 font-serif writing-vertical-rl">{data.ganZhi.split(' ')[0]}</div>
               <div className="text-sm text-stone-800 font-serif writing-vertical-rl">{data.ganZhi.split(' ')[1]}</div>
               <div className="text-sm text-cinnabar-red font-serif font-bold writing-vertical-rl">{data.ganZhi.split(' ')[2]}</div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-stone-200 my-4"></div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-xs text-stone-400 mb-2 font-bold uppercase tracking-wider">宜 Yi (Good)</h4>
            <div className="flex flex-wrap gap-2">
              {data.yi.slice(0, 3).map((item, idx) => (
                <span key={idx} className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-md border border-green-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs text-stone-400 mb-2 font-bold uppercase tracking-wider">忌 Ji (Avoid)</h4>
            <div className="flex flex-wrap gap-2">
              {data.ji.slice(0, 3).map((item, idx) => (
                <span key={idx} className="bg-red-50 text-red-800 text-xs px-2 py-1 rounded-md border border-red-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-stone-600 text-sm italic border-l-2 border-antique-gold pl-3 py-1">
          "{data.description}"
        </p>
      </div>
    </div>
  );
};