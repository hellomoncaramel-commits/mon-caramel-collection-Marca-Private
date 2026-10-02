import { Home, Heart, Search, ShoppingBag } from "lucide-react";
import { COLORS } from "../../styles/colors";
import Logo from "./Logo";

const ITEMS = [
  { id: "home", Icon: Home, label: "Início" },
  { id: "salvos", Icon: Heart, label: "Salvos" },
  { id: "busca", Icon: Search, label: "Buscar" },
  { id: "selecao", Icon: ShoppingBag, label: "Seleção" },
];

// Desktop-only top navigation (lg+) — BottomNav's own mobile/tablet
// behavior (hidden from md up) is untouched. This is now the ONE brand
// header on desktop: logo left, nav right, in a single bar — every
// screen's own SiteHeader hides its centered logo at lg+ (see
// SiteHeader.jsx) so the brand mark only appears once per page instead of
// stacking two headers. Same four destinations, same onNavigate/active
// semantics as BottomNav (App.jsx's own `activeNav`), same counts — no new
// routes, no new logic, just a second, desktop-shaped rendering of the
// identical nav state.
export default function DesktopNav({ active, onNavigate, selectionCount, favoritesCount }) {
  const badge = { salvos: favoritesCount, selecao: selectionCount };

  return (
    <div className="hidden lg:block border-b border-brand-border">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-gutter lg:px-8 xl:px-12 h-20 flex items-center justify-between">
        <button onClick={() => onNavigate("home")} aria-label="Ir para o início" className="shrink-0">
          <Logo size="header" />
        </button>
        <nav aria-label="Navegação principal" className="flex items-center gap-1">
          {ITEMS.map(({ id, Icon, label }) => {
            const isActive = active === id;
            const count = badge[id];
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="relative flex items-center gap-2 rounded-full px-4 h-10 text-sm font-medium"
                style={{ color: isActive ? COLORS.caramelDark : COLORS.inkSoft }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {label}
                {count > 0 && (
                  <span
                    className="min-w-4 h-4 px-1 rounded-full text-white text-3xs font-medium flex items-center justify-center"
                    style={{ backgroundColor: COLORS.caramelDark }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
