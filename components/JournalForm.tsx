import React from 'react';
import { JournalEntry } from '../types';
import { Smile, DollarSign, Heart, Activity, FileText } from 'lucide-react';

interface JournalFormProps {
  entry: JournalEntry;
  onChange: (field: keyof JournalEntry, value: any) => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({ entry, onChange }) => {
  const moodEmojis = ['😫', '😔', '😐', '🙂', '🤩'];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <h2 className="text-2xl font-serif text-ink-black mb-6">今日记录</h2>

      {/* Mood Section */}
      <section className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-stone-800">
          <Smile size={18} className="text-amber-600" />
          <h3 className="font-bold">情绪 Mood</h3>
        </div>
        <div className="flex justify-between mb-4 bg-stone-50 p-2 rounded-lg">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onChange('mood', index + 1)}
              className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                entry.mood === index + 1 
                  ? 'bg-amber-100 scale-110 shadow-md' 
                  : 'hover:bg-stone-200 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <textarea
          value={entry.moodNote}
          onChange={(e) => onChange('moodNote', e.target.value)}
          placeholder="此刻的心情..."
          className="w-full bg-stone-50 border-0 rounded-lg p-3 text-sm focus:ring-1 focus:ring-amber-500 min-h-[60px] resize-none"
        />
      </section>

      {/* Finance Section */}
      <section className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-stone-800">
          <DollarSign size={18} className="text-green-600" />
          <h3 className="font-bold">财务 Wealth</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="text-xs text-stone-500 mb-1 block">收入 Income</label>
            <input
              type="number"
              value={entry.financeIncome || ''}
              onChange={(e) => onChange('financeIncome', Number(e.target.value))}
              placeholder="0"
              className="w-full bg-stone-50 border-0 rounded-lg p-2 text-sm focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 mb-1 block">支出 Expense</label>
            <input
              type="number"
              value={entry.financeExpense || ''}
              onChange={(e) => onChange('financeExpense', Number(e.target.value))}
              placeholder="0"
              className="w-full bg-stone-50 border-0 rounded-lg p-2 text-sm focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
        <input
          type="text"
          value={entry.financeNote}
          onChange={(e) => onChange('financeNote', e.target.value)}
          placeholder="备注 (e.g. 购买书籍)"
          className="w-full bg-stone-50 border-0 rounded-lg p-3 text-sm focus:ring-1 focus:ring-green-500"
        />
      </section>

      {/* Relationship */}
      <section className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
         <div className="flex items-center gap-2 mb-4 text-stone-800">
          <Heart size={18} className="text-rose-500" />
          <h3 className="font-bold">人际 Relation</h3>
        </div>
        <textarea
          value={entry.relationships}
          onChange={(e) => onChange('relationships', e.target.value)}
          placeholder="今日遇到的人，发生的事..."
          className="w-full bg-stone-50 border-0 rounded-lg p-3 text-sm focus:ring-1 focus:ring-rose-500 min-h-[60px] resize-none"
        />
      </section>

      {/* Health */}
      <section className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
         <div className="flex items-center gap-2 mb-4 text-stone-800">
          <Activity size={18} className="text-blue-500" />
          <h3 className="font-bold">身体 Body</h3>
        </div>
         <div className="flex gap-2 mb-3">
            {['Good', 'Fair', 'Poor'].map((status) => (
                <button
                    key={status}
                    onClick={() => onChange('healthStatus', status)}
                    className={`flex-1 py-2 text-xs rounded-md border ${
                        entry.healthStatus === status 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' 
                        : 'border-stone-200 text-stone-500'
                    }`}
                >
                    {status === 'Good' ? '舒适' : status === 'Fair' ? '一般' : '不适'}
                </button>
            ))}
        </div>
        <textarea
          value={entry.healthNote}
          onChange={(e) => onChange('healthNote', e.target.value)}
          placeholder="睡眠，饮食，运动..."
          className="w-full bg-stone-50 border-0 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-none"
        />
      </section>

       {/* Other */}
       <section className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
         <div className="flex items-center gap-2 mb-4 text-stone-800">
          <FileText size={18} className="text-stone-500" />
          <h3 className="font-bold">杂记 Notes</h3>
        </div>
        <textarea
          value={entry.otherEvents}
          onChange={(e) => onChange('otherEvents', e.target.value)}
          placeholder="其他值得记录的瞬间..."
          className="w-full bg-stone-50 border-0 rounded-lg p-3 text-sm focus:ring-1 focus:ring-stone-500 min-h-[80px] resize-none"
        />
      </section>
    </div>
  );
};