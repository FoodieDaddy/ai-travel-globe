import { useState } from 'react';
import { Plane, Calendar, Wallet, MapPin } from 'lucide-react';

export function TravelForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    destination: '',
    days: 7,
    preferences: '',
    budgetLevel: 'medium',
    departureCity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefs = formData.preferences.split(',').map(p => p.trim()).filter(Boolean);
    onSubmit({ ...formData, preferences: prefs });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-sm">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Plane className="text-blue-400" /> AI 路线规划
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">目的地</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              required
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="想去哪里？(如：日本)"
              value={formData.destination}
              onChange={e => setFormData({ ...formData, destination: e.target.value })}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">天数</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="number" 
              required
              min="1"
              max="30"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.days}
              onChange={e => setFormData({ ...formData, days: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">偏好 (用逗号分隔)</label>
          <input 
            type="text" 
            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="动漫, 美食, 购物..."
            value={formData.preferences}
            onChange={e => setFormData({ ...formData, preferences: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">预算</label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              value={formData.budgetLevel}
              onChange={e => setFormData({ ...formData, budgetLevel: e.target.value })}
            >
              <option value="low">经济 (Low)</option>
              <option value="medium">中等 (Medium)</option>
              <option value="high">舒适 (High)</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            '生成路线'
          )}
        </button>
      </form>
    </div>
  );
}
