import { Instagram, Mail, MessageCircle } from "lucide-react";
import { COLORS } from "../../styles/colors";

// Real contact info, not placeholders — same Instagram handle SendModal
// already links to (@by_moncaramel), plus the WhatsApp number this app has
// never actually linked anywhere yet (every existing "Finalizar pelo
// WhatsApp" button just opens SendModal's copy-paste flow — see
// SelectionScreen.jsx). This is the first real wa.me deep link in the app.
const WHATSAPP_DIGITS = "16473768064"; // +1 647-376-8064, country code + number, digits only (wa.me requirement)
const WHATSAPP_MESSAGE = "Oi, Naiá! Vim pelo site da Mon Caramel 💛";

const CONTACTS = [
  {
    id: "instagram",
    Icon: Instagram,
    label: "Instagram",
    value: "@by_moncaramel",
    href: "https://instagram.com/by_moncaramel",
    external: true,
  },
  {
    id: "whatsapp",
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "Fale conosco",
    href: `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    external: true,
  },
  {
    id: "email",
    Icon: Mail,
    label: "E-mail",
    value: "hellomoncaramel@gmail.com",
    href: "mailto:hellomoncaramel@gmail.com",
    external: false,
  },
];

function ContactLink({ contact, align = "left" }) {
  const { Icon, label, value, href, external } = contact;
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group flex items-center gap-3 py-2.5 min-h-11 transition-opacity hover:opacity-80 ${
        align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
      }`}
    >
      <span
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "rgba(255,252,245,0.12)" }}
      >
        <Icon size={16} className="text-brand-beige" />
      </span>
      <span className="min-w-0">
        <span className="block text-3xs uppercase tracking-wide text-brand-beige/60">{label}</span>
        <span className="block text-sm font-medium text-brand-beige truncate">{value}</span>
      </span>
    </a>
  );
}

// Global site footer — one instance, rendered centrally in App.jsx below
// whichever screen is current (never inside a screen component itself, and
// never inside ProductDetailSheet/SendModal, which are separate `fixed`
// overlays — see App.jsx). Lives inside the same `pb-24 md:pb-0` wrapper
// every screen's content already sits in, so it inherits the same
// clearance that already keeps content clear of the fixed mobile
// BottomNav, rather than needing its own duplicate padding hack.
export default function Footer() {
  return (
    <footer className="mt-16 lg:mt-24" style={{ backgroundColor: COLORS.caramelDarker }}>
      <div className="max-w-2xl lg:max-w-6xl xl:max-w-7xl mx-auto px-gutter lg:px-8 xl:px-12 py-10 lg:py-14">
        {/* Mobile/tablet (<lg): vertical — brand mark, a hairline divider,
            then the three contact rows stacked. Desktop (lg+): two-column
            editorial split — brand mark left, "Vamos conversar" + contacts
            right — same max-width/gutter every other screen's content
            uses, so the footer's edges line up with the page above it. */}
        <div className="lg:hidden">
          <p className="font-display font-semibold text-brand-beige" style={{ fontSize: 22, letterSpacing: "0.04em" }}>
            MON CARAMEL
          </p>
          <p className="text-xs text-brand-beige/60 mt-1 font-display italic">Not your average sweet.</p>

          <div className="mt-6 pt-1 border-t" style={{ borderColor: "rgba(255,252,245,0.14)" }}>
            {CONTACTS.map((c) => (
              <ContactLink key={c.id} contact={c} />
            ))}
          </div>
        </div>

        <div className="hidden lg:flex lg:items-start lg:justify-between lg:gap-16">
          <div>
            <p className="font-display font-semibold text-brand-beige" style={{ fontSize: 26, letterSpacing: "0.04em" }}>
              MON CARAMEL
            </p>
            <p className="text-sm text-brand-beige/60 mt-1.5 font-display italic">Not your average sweet.</p>
          </div>

          <div style={{ minWidth: 280 }}>
            <p className="text-xs uppercase tracking-wide text-brand-beige/60 mb-1">Vamos conversar</p>
            <div className="flex flex-col">
              {CONTACTS.map((c) => (
                <ContactLink key={c.id} contact={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
