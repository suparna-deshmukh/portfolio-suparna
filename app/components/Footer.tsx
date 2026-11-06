import P99Hint from './P99Hint'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="links">
        <P99Hint />
        <span>© {new Date().getFullYear()} Suparna Deshmukh</span>
      </div>
    </footer>
  )
}
