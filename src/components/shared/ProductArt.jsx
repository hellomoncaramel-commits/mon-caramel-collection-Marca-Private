import { COLORS } from "../../styles/colors";

// Illustrated placeholder used for products that don't have a real photo
// organized yet — shape varies by "kind". Once every product has real
// photos, this becomes unnecessary but stays as a graceful fallback.
export default function ProductArt({ kind, tint = COLORS.caramelDark, h = null, contextIcon: ContextIcon = null }) {
  const bg = `linear-gradient(150deg, ${tint}22, ${tint}0D)`;
  return (
    <div
      className={`${h || ""} w-full rounded-2xl relative overflow-hidden ${h ? "" : "aspect-photo"}`}
      style={{ background: bg }}
    >
      <svg viewBox="0 0 200 130" className="w-full h-full">
        {kind === "sandwich" && (
          <>
            <circle cx="70" cy="65" r="30" fill={tint} opacity="0.85" />
            <circle cx="70" cy="65" r="30" fill="none" stroke={tint} strokeWidth="1.5" strokeDasharray="2 4" />
            <circle cx="70" cy="65" r="8" fill="#FFFCF5" opacity="0.9" />
            <circle cx="130" cy="80" r="24" fill={tint} opacity="0.7" />
            <circle cx="130" cy="80" r="7" fill="#FFFCF5" opacity="0.9" />
          </>
        )}
        {kind === "bites" &&
          [
            [45, 50],
            [75, 42],
            [105, 55],
            [135, 45],
            [60, 85],
            [95, 90],
            [130, 85],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="15" fill={tint} opacity={0.55 + (i % 3) * 0.12} />
          ))}
        {kind === "dipped" && (
          <>
            <circle cx="90" cy="65" r="38" fill={COLORS.ink} />
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1={90 - 32 + i * 13}
                y1="32"
                x2={90 - 25 + i * 13}
                y2="98"
                stroke={tint}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.85"
              />
            ))}
          </>
        )}
        {kind === "cake" && (
          <>
            <ellipse cx="90" cy="90" rx="46" ry="12" fill={tint} opacity="0.35" />
            <rect x="55" y="45" width="70" height="45" rx="6" fill={tint} opacity="0.85" />
            <rect x="55" y="45" width="70" height="10" rx="4" fill="#FFFCF5" opacity="0.5" />
          </>
        )}
        {kind === "candy" && (
          <>
            <circle cx="70" cy="60" r="26" fill={tint} opacity="0.9" />
            <circle cx="122" cy="75" r="22" fill={tint} opacity="0.7" />
            <circle cx="70" cy="60" r="26" fill="none" stroke="#FFFCF5" strokeWidth="1" strokeDasharray="1 3" />
          </>
        )}
      </svg>
      {ContextIcon && (
        <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center">
          <ContextIcon size={14} style={{ color: tint }} />
        </div>
      )}
    </div>
  );
}
