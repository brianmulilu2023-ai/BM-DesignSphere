import React from 'react';

export function StatCard({ title, value, icon: Icon, changeText, color = 'orange' }) {
  const colorMap = {
    orange: 'text-[#FF751F] bg-[#FF751F]/10 border-[#FF751F]/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-colors text-left flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-3xl font-heading font-extrabold text-white">
          {value}
        </div>
        {changeText && (
          <p className="text-xs text-neutral-400 pt-1 font-sans">
            {changeText}
          </p>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[color] || colorMap.orange}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}

