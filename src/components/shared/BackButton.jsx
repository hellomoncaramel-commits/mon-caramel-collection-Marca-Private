import { ArrowLeft } from "lucide-react";

export default function BackButton({ onClick, label = "Voltar" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-ink transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramelDark rounded-full px-2 py-1 -ml-2"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}
