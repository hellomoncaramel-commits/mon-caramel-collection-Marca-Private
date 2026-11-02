import { COLORS } from "../../styles/colors";

export default function PartyFloatingButton({ count, onClick }) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      // bottom-20 clears BottomNav (now visible up to lg, not just md —
      // see BottomNav.jsx); lg:bottom-6 matches once BottomNav is gone and
      // DesktopNav (a top bar) takes over, so this never sits on top of
      // the bottom nav in the tablet range it used to assume was clear.
      className="fixed bottom-20 lg:bottom-6 right-6 z-40 rounded-full px-5 py-3 text-sm font-medium text-white flex items-center gap-2 shadow-lg"
      style={{ backgroundColor: COLORS.caramelDark }}
    >
      🎉 Minha Festa ({count})
    </button>
  );
}
