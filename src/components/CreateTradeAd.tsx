import React, { useState } from "react";
import { Item } from "../types/Item";
import { CreateTradeAdData } from "../types/TradeAd";
import GradientText from "../Shared/GradientText";

interface Props {
  items: Item[];
  tags: string[];
  onClose: () => void;
  onSubmit: (data: CreateTradeAdData) => Promise<{ error: string | null }>;
  authorName: string;
  authorAvatar: string | null;
}

export const CreateTradeAdModal: React.FC<Props> = ({
  items,
  tags,
  onClose,
  onSubmit,
  authorName,
  authorAvatar,
}) => {
  const [offering, setOffering] = useState<string[]>([]);
  const [wanted, setWanted] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (list: string[], set: any, value: string) => {
    set(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    const data: CreateTradeAdData = {
      itemsOffering: offering.map(name => ({
        itemName: name,
        emoji: items.find(i => i.name === name)?.emoji || ""
      })),
      itemsWanted: wanted.map(name => ({
        itemName: name,
        emoji: items.find(i => i.name === name)?.emoji || ""
      })),
      tags: selectedTags,
      authorName,
      authorAvatar
    };

    const res = await onSubmit(data);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0c0c0c] p-6 rounded-xl w-full max-w-lg space-y-5 border border-white/5">

        <h2 className="text-xl font-bold text-center">
          <GradientText variant="gold">Create Trade Ad</GradientText>
        </h2>

        <div>
          <GradientText variant="silver">Offering</GradientText>
          <select
            onChange={(e) => toggle(offering, setOffering, e.target.value)}
            className="w-full mt-1 bg-[#111] text-white p-2 border border-zinc-800 rounded focus:outline-none"
          >
            <option className="bg-black">Select item</option>
            {items.map(i => (
              <option key={i.id} className="bg-black text-white">
                {i.name}
              </option>
            ))}
          </select>

          {offering.length > 0 && (
            <div className="text-xs mt-2 text-gray-400">
              {offering.join(", ")}
            </div>
          )}
        </div>

        <div>
          <GradientText variant="silver">Looking For</GradientText>
          <select
            onChange={(e) => toggle(wanted, setWanted, e.target.value)}
            className="w-full mt-1 bg-[#111] text-white p-2 border border-zinc-800 rounded focus:outline-none"
          >
            <option className="bg-black">Select item</option>
            {items.map(i => (
              <option key={i.id} className="bg-black text-white">
                {i.name}
              </option>
            ))}
          </select>

          {wanted.length > 0 && (
            <div className="text-xs mt-2 text-gray-400">
              {wanted.join(", ")}
            </div>
          )}
        </div>

        <div>
          <GradientText variant="silver">Tags</GradientText>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(t => (
              <button
                key={t}
                onClick={() => toggle(selectedTags, setSelectedTags, t)}
                className={`px-3 py-1 text-xs rounded border transition ${
                  selectedTags.includes(t)
                    ? "bg-yellow-700 text-white border-yellow-500"
                    : "bg-[#111] text-gray-300 border-zinc-800 hover:border-yellow-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

      </div>
    </div>
  );
};