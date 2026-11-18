import { ChevronRight } from "lucide-react";
import { COLORS } from "../../styles/colors";

// Protótipo de redesign visual (Fase 1) — ver nota em WaveDivider.jsx.
//
// Substitui o bloco sólido caramelDark (HeroActionCard, HomeScreen.jsx)
// por um cartão refinado, fora da fotografia: fundo claro, borda fina,
// ícone num círculo (não emoji solto), título em Fraunces — lê como um
// convite editorial ("escolha seu caminho"), não como um banner de
// e-commerce. Mesma função/API de clique de sempre (um id de tela), só a
// pele visual muda.
export default function EditorialPathButton({ icon: Icon, title, subtitle, onClick, size = "base" }) {
  const isLarge = size === "lg";
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 text-left transition-all duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 lg:hover:-translate-y-0.5"
      style={{
        padding: isLarge ? "18px 22px" : "14px 18px",
        borderRadius: 999,
        backgroundColor: COLORS.beige,
        border: `1.5px solid ${COLORS.border}`,
        boxShadow: "0 4px 16px rgba(61,36,24,0.08)",
      }}
    >
      <span
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{ width: isLarge ? 48 : 42, height: isLarge ? 48 : 42, backgroundColor: COLORS.caramelDark }}
      >
        <Icon size={isLarge ? 22 : 19} strokeWidth={2} className="text-brand-beige" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className="block font-display font-semibold text-brand-ink leading-snug"
          style={{ fontSize: isLarge ? 18 : 16 }}
        >
          {title}
        </span>
        <span className="block text-brand-inkSoft mt-0.5 leading-snug" style={{ fontSize: isLarge ? 14 : 13 }}>
          {subtitle}
        </span>
      </span>
      <ChevronRight size={isLarge ? 20 : 18} className="shrink-0" style={{ color: COLORS.caramelDark }} />
    </button>
  );
}
