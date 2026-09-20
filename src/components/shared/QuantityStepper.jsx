import { Minus, Plus } from "lucide-react";
import { COLORS } from "../../styles/colors";

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-brand-border">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className="w-11 h-11 flex items-center justify-center disabled:opacity-30"
      >
        <Minus size={16} className="text-brand-ink" />
      </button>
      <span className="w-6 text-center text-sm font-medium text-brand-ink" aria-live="polite">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className="w-11 h-11 flex items-center justify-center disabled:opacity-30"
      >
        <Plus size={16} style={{ color: COLORS.ink }} />
      </button>
    </div>
  );
}
