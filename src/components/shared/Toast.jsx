export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 text-sm text-white bg-brand-ink rounded-full px-4 py-2.5 shadow-lg">
      {message}
    </div>
  );
}
