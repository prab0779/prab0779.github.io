import React from 'react';
import { Trash2, History } from 'lucide-react';
import { ValueChange } from '../../types/Item';
import { ItemIcon, RateIcon } from './AdminShared';

interface ChangesViewProps {
  valueChanges: ValueChange[];
  loading: boolean;
  onDelete: (id: string, name: string) => Promise<void>;
}

export const ChangesView: React.FC<ChangesViewProps> = ({ valueChanges, loading, onDelete }) => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Value Changes</h1>
        <p className="text-white/40 text-sm">History of all item value, demand, and rate updates</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin" />
        </div>
      ) : valueChanges.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No changes recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {valueChanges.map((ch) => {
            const up = ch.newValue > ch.oldValue;
            const same = ch.newValue === ch.oldValue;
            return (
              <div
                key={ch.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#6f572c]/50 transition-colors overflow-hidden"
              >
                {/* top row */}
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ItemIcon emoji={ch.emoji} name={ch.itemName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{ch.itemName}</p>
                      <p className="text-xs text-white/30">{new Date(ch.changeDate).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        same
                          ? 'border-white/10 text-white/40'
                          : up
                          ? 'border-emerald-800/50 text-emerald-400 bg-emerald-900/20'
                          : 'border-red-800/50 text-red-400 bg-red-900/20'
                      }`}
                    >
                      {same ? 'Updated' : up ? `+${ch.newValue - ch.oldValue}` : `${ch.newValue - ch.oldValue}`}
                    </span>
                    <button
                      onClick={() => onDelete(ch.id, ch.itemName)}
                      className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* detail grid */}
                <div className="px-4 pb-3 grid grid-cols-3 gap-2">
                  <div className="bg-white/[0.03] rounded-lg p-2.5">
                    <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">Value</p>
                    <p className="text-xs text-white/40 line-through">🔑 {ch.oldValue}</p>
                    <p className="text-xs text-white font-medium">🔑 {ch.newValue}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-2.5">
                    <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">Demand</p>
                    <p className="text-xs text-white/40 line-through">{ch.oldDemand}/10</p>
                    <p className="text-xs text-white font-medium">{ch.newDemand}/10</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg p-2.5">
                    <p className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">Rate</p>
                    <div className="flex items-center gap-1 opacity-50 line-through">
                      <RateIcon rate={ch.oldRateOfChange} />
                      <span className="text-xs text-white/40">{ch.oldRateOfChange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RateIcon rate={ch.newRateOfChange} />
                      <span className="text-xs text-white font-medium">{ch.newRateOfChange}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
