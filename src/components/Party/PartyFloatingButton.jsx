import { COLORS } from "../../styles/colors";

export default function PartyFloatingButton({ count, onClick }) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 md:bottom-6 right-6 z-40 rounded-full px-5 py-3 text-sm font-medium text-white flex items-center gap-2 shadow-lg"
      style={{ backgroundColor: COLORS.caramelDark }}
    >
      🎉 Minha Festa ({count})
    </button>
  );
}
