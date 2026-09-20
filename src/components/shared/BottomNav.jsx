import { Home, Heart, Search, ShoppingBag } from "lucide-react";
import { COLORS } from "../../styles/colors";

const ITEMS = [
  { id: "home", Icon: Home, label: "Início" },
  { id: "salvos", Icon: Heart, label: "Salvos" },
  { id: "busca", Icon: Search, label: "Buscar" },
  { id: "selecao", Icon: ShoppingBag, label: "Seleção" },
];

// Fixed, thumb-reachable bottom navigation — mobile only (desktop drops it,
// see App.jsx). Labels sit under every icon so nothing here needs an
// aria-label hack, and every tap target is a full 44px+ column.
export default function BottomNav({ active, onNavigate, selectionCount, favoritesCount }) {
  const badge = { salvos: favoritesCount, selecao: selectionCount };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-brand-border pb-safe md:hidden"
      aria-label="Navegação principal"
    >
      <div className="max-w-xl mx-auto grid grid-cols-4">
        {ITEMS.map(({ id, Icon, label }) => {
          const isActive = active === id;
          const count = badge[id];
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-11"
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} color={isActive ? COLORS.caramelDark : COLORS.muted} />
                {count > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full text-white text-3xs font-medium flex items-center justify-center"
                    style={{ backgroundColor: COLORS.caramelDark }}
                  >
                    {count}
                  </span>
                )}
              </span>
              <span className="text-3xs font-medium" style={{ color: isActive ? COLORS.caramelDark : COLORS.muted }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
