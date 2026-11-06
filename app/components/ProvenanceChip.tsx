import type { Provenance } from '../lib/site'

/** Where the data came from (sections brief X-5). Never renders without a value. */
export default function ProvenanceChip({ p }: { p?: Provenance }) {
  if (!p) return null
  const label = { public: 'Public data', synthetic: 'Synthetic data', client: 'Client data' }[p]
  return <span className="prov">{label}</span>
}
