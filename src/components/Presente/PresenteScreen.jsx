import { useMemo, useRef } from "react";
import { MessageCircle } from "lucide-react";
import BackButton from "../shared/BackButton";
import InspirationGallery from "./InspirationGallery";
import IdeaConfigurator from "./IdeaConfigurator";
import MimosSection from "./MimosSection";
import { getInspiration, getMimos, CAIXA_MUST_HAVES, BANDEJA_OCCASIONS, BANDEJA_CONTENTS } from "../../data/giftOptions";
import { buildSelectionMessage } from "../../utils/messages";
import { entryKey } from "../../utils/selectionKey";
import { COLORS } from "../../styles/colors";

const NAV = [
  { id: "caixas", emoji: "🎁", label: "Caixas" },
  { id: "bandejas", emoji: "🎈", label: "Bandejas" },
  { id: "mimos", emoji: "✨", label: "Pequenos Mimos" },
];

function describeEntry(it) {
  if (it.kind === "product") return it.name;
  if (it.kind === "inspiration") return it.title;
  return `${it.groupLabel}${it.items?.length ? `: ${it.items.join(", ")}` : ""}`;
}

// One fluid page for "É só uma lembrancinha" — three formats (Caixas,
// Bandejas, Pequenos Mimos) reachable by smooth-scrolling chips, never
// three separate pages. Caixas/Bandejas show real past work as inspiration
// (never as fixed SKUs); Mimos, being individual products, reads like an
// actual small catalog.
export default function PresenteScreen({
  onBack,
  onGoCatalog,
  onSend,
  selection,
  addToSelection,
  removeFromSelection,
  isSelected,
  onOpenSelection,
}) {
  const sectionRefs = { caixas: useRef(null), bandejas: useRef(null), mimos: useRef(null) };
  const scrollTo = (id) => sectionRefs[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const caixasInspiration = useMemo(() => getInspiration("caixas"), []);
  const bandejasInspiration = useMemo(() => getInspiration("bandejas"), []);
  const mimoIds = useMemo(() => getMimos().map((m) => m.id), []);

  const saveInspiration = (group) => (item) => {
    const entry = { kind: "inspiration", id: item.id, group, title: item.caption, photo: item.photo };
    if (isSelected(entry)) removeFromSelection(entry);
    else addToSelection(entry);
  };

  // The recap at the end only pulls in presente-flavored entries (liked
  // references, configured ideas, mimos) — a normal "Brigadeiros" added
  // from the Café moment doesn't show up here, it lives in Minha Seleção.
  const presenteEntries = selection.filter(
    (it) => it.kind === "inspiration" || it.kind === "gift-idea" || (it.kind === "product" && mimoIds.includes(it.productId))
  );

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-28 fade-up">
      <BackButton onClick={onBack} label="Voltar" />

      <p className="text-lg mb-1 font-display text-brand-ink">Cada presente é único.</p>
      <p className="text-sm mb-6 text-brand-inkSoft">
        Veja coisas que já fizemos, inspire-se e monte uma ideia. Depois a gente cria algo especialmente para quem vai
        receber.
      </p>

      <div className="flex flex-wrap gap-2 mb-12">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => scrollTo(n.id)}
            className="text-sm font-medium rounded-full px-4 py-2.5 border border-brand-caramelDark text-brand-caramelDark"
          >
            {n.emoji} {n.label}
          </button>
        ))}
      </div>

      {/* CAIXAS */}
      <section ref={sectionRefs.caixas} className="scroll-mt-6">
        <p className="text-2xl font-display text-brand-ink mb-1">Caixas para presentear</p>
        <p className="text-sm mb-6 italic font-subtitle text-brand-inkSoft">
          Inspire-se. A sua não precisa ser igual a nenhuma delas.
        </p>
        <InspirationGallery items={caixasInspiration} isSaved={isSelected} onToggleSave={saveInspiration("caixas")} />
        <IdeaConfigurator
          title="Agora vamos imaginar a sua 💛"
          groupKey="caixas"
          groupLabel="Caixa"
          items={{ question: "O que não pode faltar?", options: CAIXA_MUST_HAVES }}
          onAdd={addToSelection}
        />
      </section>

      {/* BANDEJAS */}
      <section ref={sectionRefs.bandejas} className="scroll-mt-6 mt-16">
        <p className="text-2xl font-display text-brand-ink mb-1">Bandejas para celebrar 🎈</p>
        <p className="text-sm mb-6 text-brand-inkSoft">
          Também são inspiração — a gente conhece essa história, foi assim que muita festa começou.
        </p>
        <InspirationGallery items={bandejasInspiration} isSaved={isSelected} onToggleSave={saveInspiration("bandejas")} />
        <IdeaConfigurator
          title="Vamos montar a ideia?"
          groupKey="bandejas"
          groupLabel="Bandeja"
          occasion={{ question: "Qual é a ocasião?", options: BANDEJA_OCCASIONS }}
          items={{ question: "O que você gostaria de incluir?", options: BANDEJA_CONTENTS }}
          onAdd={addToSelection}
        />
      </section>

      {/* PEQUENOS MIMOS */}
      <section ref={sectionRefs.mimos} className="scroll-mt-6 mt-16">
        <p className="text-2xl font-display text-brand-ink mb-1">Pequenos mimos 💛</p>
        <p className="text-sm mb-6 italic font-subtitle text-brand-inkSoft">Um jeitinho pequeno de fazer alguém sorrir.</p>
        <MimosSection selection={selection} addToSelection={addToSelection} />
      </section>

      {presenteEntries.length > 0 && (
        <div className="mt-16 rounded-3xl p-6" style={{ backgroundColor: COLORS.subtle }}>
          <p className="text-lg font-display text-brand-ink mb-3">♡ Sua seleção</p>
          <ul className="text-sm space-y-1.5 text-brand-ink mb-5">
            {presenteEntries.map((it) => (
              <li key={entryKey(it)}>✓ {describeEntry(it)}</li>
            ))}
          </ul>
          <p className="text-base font-display text-brand-ink mb-3">Vamos transformar isso em presente?</p>
          <button
            onClick={() => onSend(buildSelectionMessage(presenteEntries))}
            className="w-full text-sm font-medium text-white rounded-full py-3 flex items-center justify-center gap-2"
            style={{ backgroundColor: COLORS.caramelDark }}
          >
            <MessageCircle size={15} />
            Conversar com a Mon Caramel no WhatsApp
          </button>
          <button onClick={onOpenSelection} className="w-full text-center text-xs mt-3 underline text-brand-muted">
            Ver minha seleção completa
          </button>
        </div>
      )}

      <button onClick={onGoCatalog} className="w-full text-center text-xs mt-8 py-2 underline text-brand-muted">
        Não encontrou o que imaginava? Explore toda a coleção.
      </button>
    </div>
  );
}
