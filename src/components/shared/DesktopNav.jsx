import { Heart, Search, ShoppingBag } from "lucide-react";
import { COLORS } from "../../styles/colors";
import Logo from "./Logo";

// Primary site nav — real destinations only (no "Quem Somos"/"Mais", those
// don't exist in this app). "Nossos doces" and "Presentes" aren't in
// App.jsx's activeNav computation (that only tracks home/salvos/busca/
// selecao — see App.jsx), so only "Início" gets the underline; the other
// two are real, working links, just without an active indicator yet.
const PRIMARY_ITEMS = [
  { id: "home", label: "Início" },
  { id: "feed", label: "Nossos doces" },
  { id: "presente", label: "Presentes" },
];

// Desktop-only top navigation (lg+) — BottomNav's own mobile/tablet
// behavior (hidden from md up) is untouched. This is the ONE brand header
// on desktop: logo, primary nav, a search entry point, and the two
// personal-state destinations (Salvos/Seleção) — every screen's own
// SiteHeader hides its centered logo at lg+ (see SiteHeader.jsx) so the
// brand mark only appears once per page. No "Entrar"/"Sacola"/checkout —
// this app doesn't have accounts or a cart, just Salvos (favorites) and
// Seleção (the pre-WhatsApp list), both real, existing destinations.
export default function DesktopNav({ active, onNavigate, selectionCount, favoritesCount }) {
  return (
    <div className="hidden lg:block border-b border-brand-border">
      <div className="w-full px-6 h-[100px] flex items-center gap-10">
        <button onClick={() => onNavigate("home")} aria-label="Ir para o início" className="shrink-0">
          <Logo size="header" />
        </button>

        <nav aria-label="Navegação principal" className="flex items-center gap-8 shrink-0">
          {PRIMARY_ITEMS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="text-[15px] font-medium pb-1 border-b-2"
                style={{
                  color: isActive ? COLORS.caramelDark : COLORS.ink,
                  borderColor: isActive ? COLORS.caramelDark : "transparent",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <button
          onClick={() => onNavigate("busca")}
          aria-label="Buscar doces, sabores"
          className="flex items-center gap-2.5 w-[260px] h-[52px] rounded-full px-5 shrink-0"
          style={{ backgroundColor: COLORS.subtle, border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 3px rgba(61,36,24,0.06)" }}
        >
          <Search size={17} className="text-brand-muted shrink-0" />
          <span className="text-sm text-brand-muted truncate">Buscar doces, sabores...</span>
        </button>

        <button onClick={() => onNavigate("salvos")} className="flex flex-col items-center gap-0.5 shrink-0" aria-current={active === "salvos" ? "page" : undefined}>
          <span className="relative">
            <Heart size={20} strokeWidth={active === "salvos" ? 2.5 : 2} style={{ color: active === "salvos" ? COLORS.caramelDark : COLORS.ink }} />
            {favoritesCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-white text-3xs font-medium flex items-center justify-center"
                style={{ backgroundColor: COLORS.caramelDark }}
              >
                {favoritesCount}
              </span>
            )}
          </span>
          <span className="text-xs font-medium" style={{ color: active === "salvos" ? COLORS.caramelDark : COLORS.ink }}>
            Salvos
          </span>
        </button>

        <button onClick={() => onNavigate("selecao")} className="flex flex-col items-center gap-0.5 shrink-0" aria-current={active === "selecao" ? "page" : undefined}>
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={active === "selecao" ? 2.5 : 2} style={{ color: active === "selecao" ? COLORS.caramelDark : COLORS.ink }} />
            {selectionCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-white text-3xs font-medium flex items-center justify-center"
                style={{ backgroundColor: COLORS.caramelDark }}
              >
                {selectionCount}
              </span>
            )}
          </span>
          <span className="text-xs font-medium" style={{ color: active === "selecao" ? COLORS.caramelDark : COLORS.ink }}>
            Seleção
          </span>
        </button>
      </div>
    </div>
  );
}
