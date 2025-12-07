import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { Item } from "../../types/Item";

interface Props {
  item?: Item | null;
  onClose: () => void;
  onSubmit: (data: Omit<Item, "id">) => Promise<any>;
}

export default function ItemFormModal({ item, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<Omit<Item, "id">>({
    name: item?.name || "",
    emoji: item?.emoji || "",
    value: item?.value || 0,
    demand: item?.demand || 1,
    rateOfChange: item?.rateOfChange || "Stable",
    prestige: item?.prestige || 0,
    status: item?.status || "Active",
    obtainedFrom: item?.obtainedFrom || "",
    gemTax: item?.gemTax || 0,
    goldTax: item?.goldTax || 0,
    category: item?.category || "",
    rarity: item?.rarity || "",
  });

  const updateField = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-5">
      <div className="bg-[#0d0d0d] border border-red-900 rounded-xl w-full max-w-3xl p-7 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-red-400">
            {item ? "Edit Item" : "Create New Item"}
          </h2>

          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="text-sm text-gray-300">Name</label>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
                required
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="text-sm text-gray-300">Emoji (or image path)</label>
              <input
                value={form.emoji}
                onChange={(e) => updateField("emoji", e.target.value)}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              />
            </div>

            {/* Value */}
            <div>
              <label className="text-sm text-gray-300">Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => updateField("value", Number(e.target.value))}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
                required
              />
            </div>

            {/* Demand */}
            <div>
              <label className="text-sm text-gray-300">Demand (1–10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.demand}
                onChange={(e) => updateField("demand", Number(e.target.value))}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              />
            </div>

            {/* Prestige */}
            <div>
              <label className="text-sm text-gray-300">Prestige</label>
              <input
                type="number"
                value={form.prestige}
                onChange={(e) => updateField("prestige", Number(e.target.value))}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            
            {/* Category */}
            <div>
              <label className="text-sm text-gray-300">Category</label>
              <input
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              />
            </div>

            {/* Rarity */}
            <div>
              <label className="text-sm text-gray-300">Rarity</label>
              <input
                value={form.rarity}
                onChange={(e) => updateField("rarity", e.target.value)}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              />
            </div>

            {/* Rate Of Change */}
            <div>
              <label className="text-sm text-gray-300">Rate of Change</label>
              <select
                value={form.rateOfChange}
                onChange={(e) => updateField("rateOfChange", e.target.value)}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              >
                <option>Stable</option>
                <option>Rising</option>
                <option>Dropping</option>
                <option>High Demand</option>
                <option>Low Demand</option>
              </select>
            </div>

            {/* Obtained From */}
            <div>
              <label className="text-sm text-gray-300">Obtained From</label>
              <input
                value={form.obtainedFrom}
                onChange={(e) => updateField("obtainedFrom", e.target.value)}
                className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
              />
            </div>

            {/* Taxes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Gem Tax</label>
                <input
                  type="number"
                  value={form.gemTax}
                  onChange={(e) => updateField("gemTax", Number(e.target.value))}
                  className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Gold Tax</label>
                <input
                  type="number"
                  value={form.goldTax}
                  onChange={(e) => updateField("goldTax", Number(e.target.value))}
                  className="w-full bg-black border border-red-800 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="col-span-2 flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-red-700 hover:bg-red-800 rounded flex items-center space-x-2 text-white"
            >
              <Save className="w-4 h-4" />
              <span>{item ? "Save Changes" : "Create Item"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
