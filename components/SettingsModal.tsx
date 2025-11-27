import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (user: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(user);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, isSetup: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="font-serif font-bold text-lg text-ink-black">个人信息</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-200 rounded-full transition-colors">
            <X size={20} className="text-stone-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">姓名 / 昵称</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all"
              placeholder="您的称呼"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">出生日期 (公历)</label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={e => setFormData({...formData, birthDate: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">出生时间</label>
            <input
              type="time"
              required
              value={formData.birthTime}
              onChange={e => setFormData({...formData, birthTime: e.target.value})}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all"
            />
            <p className="text-[10px] text-stone-400 mt-2">
              * 准确的时间对于八字排盘至关重要 (The exact time is crucial for Bazi chart).
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-ink-black text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
            >
              保存信息
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};