import { useState } from "react";
import { X, Copy, Instagram } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl flex flex-col fade-up bg-brand-beige"
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-display text-brand-ink">Pronto pra enviar</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-subtle" aria-label="Fechar">
            <X size={20} className="text-brand-ink" />
          </button>
        </div>
        <p className="text-sm mb-4 leading-relaxed text-brand-inkSoft">
          Copie e nos mande pelo Instagram ou WhatsApp — a gente cuida do resto.
        </p>
        <div className="border border-brand-border rounded-2xl p-4 text-sm whitespace-pre-wrap overflow-y-auto flex-1 leading-relaxed bg-brand-subtle text-brand-ink">
          {message}
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={copy}
            className="text-sm font-medium text-white bg-brand-ink rounded-full py-2.5 transition-transform active:scale-95 flex items-center justify-center gap-2"
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
            Abrir Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
