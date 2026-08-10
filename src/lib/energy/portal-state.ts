// Seasonal gating for the Energy Portal.
//
// The Lion's Gate window runs July 26 through August 12 every year. Inside the
// window the tool runs in full 8/8 "gate" mode. Outside it, it reverts to the
// evergreen "Where Should My Energy Go?" tool. `portalState` takes `now` as a
// parameter so nothing depends on module-load time.

export type PortalMode = 'gate' | 'evergreen'

export interface PortalState {
  mode: PortalMode
  peak: boolean
  daysToClose: number
  daysToOpen: number
}

const GATE_OPEN_MONTH = 7
const GATE_OPEN_DAY = 26 // July 26
const GATE_CLOSE_MONTH = 8
const GATE_CLOSE_DAY = 12 // August 12

export function portalState(now: Date): PortalState {
  const y = now.getFullYear()
  const open = new Date(y, GATE_OPEN_MONTH - 1, GATE_OPEN_DAY)
  const close = new Date(y, GATE_CLOSE_MONTH - 1, GATE_CLOSE_DAY, 23, 59, 59)
  const inWindow = now >= open && now <= close
  const peak = inWindow && now.getMonth() === 7 && now.getDate() === 8
  const nextOpen = now > close ? new Date(y + 1, GATE_OPEN_MONTH - 1, GATE_OPEN_DAY) : open
  const dayMs = 86400000
  return {
    mode: inWindow ? 'gate' : 'evergreen',
    peak,
    daysToClose: Math.max(0, Math.ceil((close.getTime() - now.getTime()) / dayMs)),
    daysToOpen: Math.max(0, Math.ceil((nextOpen.getTime() - now.getTime()) / dayMs)),
  }
}

export interface ModeCopy {
  title: string
  eyebrow: string
  heroTitle: string
  heroSub: string
  status: string
  statusClosed: boolean
  btnRun: string
  focusEyebrow: string
  btnBegin: string
  ritualEyebrow: string
  askCost: string
  themeClose: string
  btnCompose: string
  declEyebrow: string
  btnSave: string
  ckPortal: string
  ckReset: string
  bridge: string
  upgradeSub: string
  instructionPrefix: string
  quietChart: string
  leoSignal: string
  step8Err: string
  cardHeader: string
  cardFile: string
}

// The copy interpolates portal timing (peak, days remaining), so it is built
// from a PortalState rather than being a static constant. Pass a state whose
// `mode` reflects any `?mode=` override the UI has applied.
export function MODECOPY(ps: PortalState): ModeCopy {
  const isGate = ps.mode === 'gate'
  if (isGate) {
    return {
      title: "The 8/8 Portal · Your Lion's Gate focus, decoded",
      eyebrow: 'The 8/8 Portal',
      heroTitle: ps.peak
        ? "It's 8/8. Where should your energy actually go?"
        : 'The portal is open. Where should your energy actually go?',
      heroSub:
        "Lion's Gate gets talked about as a day to manifest everything. Your chart may be telling you to focus on one thing.",
      status: ps.peak
        ? '8/8 · The portal peaks today'
        : 'Portal open · closes August 12 · ' +
          ps.daysToClose +
          (ps.daysToClose === 1 ? ' day left' : ' days left'),
      statusClosed: false,
      btnRun: 'Show Me My 8/8 Focus',
      focusEyebrow: 'Your 8/8 Focus',
      btnBegin: 'Begin the 8/8 Reset →',
      ritualEyebrow: 'Iter8: The 8/8 Reset',
      askCost:
        'If nothing changes between today and 8/8/2028, what will this pattern cost you in time, money, energy or peace?',
      themeClose: 'Close the gate behind you.',
      btnCompose: 'Compose My 8/8 Declaration',
      declEyebrow: 'Your 8/8 Declaration',
      btnSave: 'Save My 8/8 Declaration',
      ckPortal: '8/8 Portal',
      ckReset: '8/8 Reset',
      bridge: "Lion's Gate is the invitation. Iter8 is what happens after you decide.",
      upgradeSub: 'Continue from 8/8 through 8/26. One activity a day, most under 30 minutes.',
      instructionPrefix: "Your Lion's Gate instruction: ",
      quietChart: "A quiet chart today. Lion's Gate itself sets the focus.",
      leoSignal: "Sun in Leo, the Lion's Gate sign itself",
      step8Err: 'Step 8 closes the gate. Finish "no longer..."',
      cardHeader: "8 / 8  L I O N ' S  G A T E",
      cardFile: 'my-8-8-declaration.png',
    }
  }
  return {
    title: 'Where Should My Energy Go? · An Iter8 tool',
    eyebrow: 'An Iter8 Tool',
    heroTitle: 'Where should your energy actually go?',
    heroSub:
      "You don't need a cosmic deadline to focus. Your chart may be telling you to pick one thing and build it.",
    status:
      "The next Lion's Gate opens July 26 · " +
      ps.daysToOpen +
      (ps.daysToOpen === 1 ? ' day' : ' days'),
    statusClosed: true,
    btnRun: 'Show Me My Focus',
    focusEyebrow: 'Your Focus',
    btnBegin: 'Begin the Reset →',
    ritualEyebrow: 'Iter8: The Reset',
    askCost:
      'If nothing changes between today and two years from now, what will this pattern cost you in time, money, energy or peace?',
    themeClose: 'Close the door behind you.',
    btnCompose: 'Compose My Declaration',
    declEyebrow: 'Your Declaration',
    btnSave: 'Save My Declaration',
    ckPortal: 'Energy Portal',
    ckReset: 'The Reset',
    bridge: 'Clarity is the invitation. Iter8 is what happens after you decide.',
    upgradeSub: 'Continue for the next 18 days. One activity a day, most under 30 minutes.',
    instructionPrefix: 'Your instruction: ',
    quietChart: 'A quiet chart. We default your focus to visibility work.',
    leoSignal: 'Sun in Leo, built for visibility',
    step8Err: 'Step 8 closes it out. Finish "no longer..."',
    cardHeader: 'W H E R E   M Y   E N E R G Y   G O E S',
    cardFile: 'my-energy-declaration.png',
  }
}
