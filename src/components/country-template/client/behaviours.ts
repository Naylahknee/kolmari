/* Progressive-disclosure toggles for static, server-rendered content.
   These mutate the DOM directly, which is safe here only because React never
   re-renders these subtrees. Do not reach for this pattern on dynamic content. */
'use client'

export function toggleAcc(btn: HTMLElement) {
  const open = btn.getAttribute('aria-expanded') === 'true'
  btn.setAttribute('aria-expanded', String(!open))
  const body = btn.parentElement?.querySelector<HTMLElement>('.acc-body')
  if (body) body.hidden = open
}

export function toggleRoute(btn: HTMLElement) {
  const open = btn.getAttribute('aria-expanded') === 'true'
  btn.setAttribute('aria-expanded', String(!open))
  const d = btn.parentElement?.querySelector<HTMLElement>('.route-detail')
  if (d) d.hidden = open
  const label = btn.querySelector('.ml')
  if (label) label.textContent = open ? 'More detail' : 'Less detail'
}

function tick(el: HTMLElement, scope: string, counter: string, suffix: string) {
  el.classList.toggle('done')
  const box = el.closest(scope)
  if (!box) return
  const total = box.querySelectorAll('.step').length
  const done = box.querySelectorAll('.step.done').length
  const c = document.querySelector(counter)
  if (c) c.textContent = `${done} / ${total}${suffix}`
}

export const toggleStep = (el: HTMLElement) => tick(el, '.acc-body', '.acc-count', '')
export const toggleDoc  = (el: HTMLElement) => tick(el, '#p-move', '#docCount', ' gathered')
export const toggleFin  = (el: HTMLElement) => tick(el, '.doc-g', '#finCount', ' done')

export function toggleTree(btn: HTMLElement) {
  const open = btn.getAttribute('aria-expanded') === 'true'
  btn.setAttribute('aria-expanded', String(!open))
  const tree = btn.parentElement?.querySelector<HTMLElement>('.sb-tree')
  if (tree) tree.hidden = open
}
