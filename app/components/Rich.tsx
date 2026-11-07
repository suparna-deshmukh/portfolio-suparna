/** Renders **bold** markers as real <b> — the punchy one-liners carry their key words this way. */
export default function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className={className}>
      {parts.map((p, i) => (p.startsWith('**') && p.endsWith('**')
        ? <b key={i}>{p.slice(2, -2)}</b>
        : p))}
    </span>
  )
}
