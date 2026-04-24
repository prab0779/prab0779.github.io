import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Item } from '../../types/Item';
import { ValueChange } from '../../types/Item';

interface SettingsViewProps {
  maintenanceMode: boolean;
  onMaintenanceModeChange: (enabled: boolean) => void;
  items: Item[];
  valueChanges: ValueChange[];
  onlineCount: number;
  categories: string[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  maintenanceMode,
  onMaintenanceModeChange,
  items,
  valueChanges,
  onlineCount,
  categories,
}) => {
  const stats = [
    { label: 'Total Items', value: items.length, color: 'text-[#c4a04a]' },
    { label: 'Value Changes', value: valueChanges.length, color: 'text-white' },
    { label: 'Online Users', value: onlineCount, color: 'text-emerald-400' },
    { label: 'Categories', value: categories.length, color: 'text-white' },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Site Settings</h1>
        <p className="text-white/40 text-sm">Manage site-wide configuration</p>
      </div>

      {/* Maintenance toggle */}
      <div className="rounded-2xl border border-[#6f572c]/40 bg-white/[0.03] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-[#c4a04a]" />
              <h3 className="font-semibold text-white text-sm">Maintenance Mode</h3>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs">
              Shows a maintenance popup to all non-admin users and blocks site interaction.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-xs font-semibold ${maintenanceMode ? 'text-red-400' : 'text-emerald-400'}`}>
              {maintenanceMode ? 'Active' : 'Off'}
            </span>
            <button
              onClick={() => onMaintenanceModeChange(!maintenanceMode)}
              className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none ${
                maintenanceMode ? 'bg-red-600' : 'bg-emerald-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        {maintenanceMode && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-900/20 border border-red-800/40 text-red-300 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Maintenance active — public users are blocked.
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-white/40 text-xs mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
