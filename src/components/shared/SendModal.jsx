import { useState } from "react";
import { X, Copy, Instagram, MessageCircle, CheckCircle2 } from "lucide-react";
import { COLORS } from "../../styles/colors";

// Same number Footer.jsx already links to (+1 647-376-8064) — kept as its
// own local constant here rather than a shared one, matching how Footer
// defines its own copy of this instead of importing a shared module; low
// enough duplication (one string, one place each) not to be worth a shared
// constants file for launch.
const WHATSAPP_DIGITS = "16473768064";

export default function SendModal({ message, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied by the browser — copying is a
      // convenience, the text is already visible for the customer to select.
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl flex flex-col fade-up bg-brand-beige"
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={22} className="text-brand-caramelDark" />
            <h2 className="text-xl font-display text-brand-ink">Sua ideia está pronta! 🎉</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-subtle shrink-0" aria-label="Fechar">
            <X size={20} className="text-brand-ink" />
          </button>
        </div>
        <p className="text-sm mb-4 leading-relaxed text-brand-inkSoft">
          Toque em "Abrir WhatsApp" pra mandar essa mensagem pronta pra gente — a gente cuida do resto a partir daqui.
        </p>
        <div className="border border-brand-border rounded-2xl p-4 text-sm whitespace-pre-wrap overflow-y-auto flex-1 leading-relaxed bg-brand-subtle text-brand-ink">
          {message}
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          {/* Primary, obvious action — opens WhatsApp with this exact
              message already filled in, no copy/paste needed. */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-center text-white rounded-full py-3 flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{ backgroundColor: COLORS.caramelDark }}
          >
            <MessageCircle size={16} />
            Abrir WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={copy}
              className="text-sm font-medium text-brand-ink border border-brand-border rounded-full py-2.5 transition-transform active:scale-95 flex items-center justify-center gap-2 hover:border-brand-caramelDark"
            >
              <Copy size={14} />
              {copied ? "Copiado ✓" : "Copiar mensagem"}
            </button>
            <a
              href="https://instagram.com/by_moncaramel"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-center border border-brand-border text-brand-ink rounded-full py-2.5 flex items-center justify-center gap-2 hover:border-brand-caramelDark"
            >
              <Instagram size={16} />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
