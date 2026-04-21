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
  const [contact, setContact] = useState("");
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
      contactInfo: contact,
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0c0c0c] p-6 rounded-xl w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">
          <GradientText variant="gold">Create Trade Ad</GradientText>
        </h2>

        <div>
          <p className="text-sm mb-1">Offering</p>
          <select
            onChange={(e) => toggle(offering, setOffering, e.target.value)}
            className="w-full bg-[#111] p-2 border border-zinc-800"
          >
            <option>Select item</option>
            {items.map(i => <option key={i.id}>{i.name}</option>)}
          </select>
          <div className="text-xs mt-1">{offering.join(", ")}</div>
        </div>

        <div>
          <p className="text-sm mb-1">Looking For</p>
          <select
            onChange={(e) => toggle(wanted, setWanted, e.target.value)}
            className="w-full bg-[#111] p-2 border border-zinc-800"
          >
            <option>Select item</option>
            {items.map(i => <option key={i.id}>{i.name}</option>)}
          </select>
          <div className="text-xs mt-1">{wanted.join(", ")}</div>
        </div>

        <div>
          <p className="text-sm mb-1">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <button
                key={t}
                onClick={() => toggle(selectedTags, setSelectedTags, t)}
                className={`px-2 py-1 text-xs border ${
                  selectedTags.includes(t)
                    ? "bg-yellow-700"
                    : "bg-[#111] border-zinc-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <input
          placeholder="Contact info (Discord, etc)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full bg-[#111] p-2 border border-zinc-800"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-700">Cancel</button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-700"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};