import { useStockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";

export const StockRotationAdmin = () => {
  const { rotation, loading, saving, saveRotation } = useStockRotation();
  const { items } = useItems();

  const slots = [
    rotation.slot1_id,
    rotation.slot2_id,
    rotation.slot3_id,
    rotation.slot4_id,
  ];

  const updateSlot = (index: number, val: string | null) => {
    const updated = { ...rotation };
    updated[`slot${index + 1}_id` as keyof StockRotation] = val;
    saveRotation(updated);
  };
