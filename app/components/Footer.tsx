'use client'

import P99Hint from './P99Hint'
import { useMotionPref, setMotion } from '../lib/motion'

export default function Footer() {
  const motion = useMotionPref()
  const toggle = () => { setMotion(motion === 'off' ? 'on' : 'off') }
  return (
    <footer className="foot">
      <div className="links">
        <button type="button" className="foot-motion" onClick={toggle}
          aria-label={motion === 'off' ? 'Motion: off. Turn motion on' : 'Motion: on. Turn motion off'}>
          Motion: {motion === 'off' ? 'off' : 'on'}
        </button>
        <P99Hint />
        <span>© {new Date().getFullYear()} Suparna Deshmukh</span>
      </div>
    </footer>
  )
}
