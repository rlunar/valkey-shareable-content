// Shared D3 helpers for the click-driven diagrams in this deck.
// Visual grammar follows sessions/well-architected-on-a-budget:
// white node cards with lavender borders, periwinkle fast paths, maroon expensive paths,
// pill labels on flows, and a deep-purple step bar under the canvas.
import * as d3 from 'd3'
import valkeyMark from '@valkey-assets/logos/valkey-icon-periwinkle.svg'

export const VK = {
  purple: '#30176e',
  red: '#642637',
  blue: '#6983ff',
  black: '#1a2026',
  candy: '#e0a2af',
  lavender: '#bcb5e7',
  white: '#fffdfa',
  cream: '#f7fbfe',
  mist: '#d3dde7',
  current: '#f1effd',
  muted: '#596672',
  redFill: '#faedf0',
  blueFill: '#eef2ff',
  green: '#2f8f6b',
}

export const FONT_BODY = "'Open Sans', 'Segoe UI', sans-serif"
export const FONT_CODE = "'Cascadia Code', 'SFMono-Regular', Consolas, monospace"

export const EASE = d3.easeCubicOut

/** True while Slidev is exporting or printing: skip transient motion and jump to end states. */
export function isStatic() {
  if (typeof window === 'undefined') return true
  const path = window.location.pathname
  if (path.includes('/print') || path.includes('/export')) return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function tr(selection, duration = 420) {
  return isStatic() ? selection : selection.transition().duration(duration).ease(EASE)
}

export function fmt(n) {
  return d3.format(',')(Math.round(n))
}

export function addMarkers(svg, prefix) {
  const defs = svg.append('defs')
  for (const [name, color] of [['blue', VK.blue], ['red', VK.red], ['purple', VK.purple], ['muted', VK.muted], ['green', VK.green]]) {
    // userSpaceOnUse keeps arrowheads a constant 12px, whatever the stroke width of the path.
    defs.append('marker')
      .attr('id', `${prefix}-arrow-${name}`)
      .attr('viewBox', '0 0 10 10').attr('refX', 9).attr('refY', 5)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('markerWidth', 12).attr('markerHeight', 12).attr('orient', 'auto-start-reverse')
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', color)
  }
  return defs
}

export function toneColor(tone) {
  return { blue: VK.blue, red: VK.red, purple: VK.purple, muted: VK.muted, green: VK.green }[tone] || VK.blue
}

/**
 * Draw a node card. Returns a controller with setState('idle' | 'current' | 'down' | 'good' | 'warn')
 * and setStatus(text) for the small status line under the label.
 */
export function card(parent, { x, y, w = 190, h = 84, eyebrow = '', label = '', status = '', valkey = false, glyph = '', id = '' }) {
  const g = parent.append('g').attr('class', 'node').attr('data-node', id).attr('transform', `translate(${x},${y})`)
  const rect = g.append('rect').attr('width', w).attr('height', h).attr('rx', 2)
    .attr('fill', VK.white).attr('stroke', VK.lavender).attr('stroke-width', 2)
  const eyebrowText = g.append('text').attr('x', w / 2).attr('y', 20).attr('text-anchor', 'middle')
    .attr('fill', VK.purple).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 700)
    .attr('letter-spacing', 1).text(eyebrow)
  const labelText = g.append('text').attr('x', w / 2).attr('y', 46).attr('text-anchor', 'middle')
    .attr('fill', VK.black).attr('font-family', FONT_BODY).attr('font-size', 16).attr('font-weight', 600).text(label)
  const statusText = g.append('text').attr('x', w / 2).attr('y', 68).attr('text-anchor', 'middle')
    .attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).text(status)
  if (valkey) {
    g.append('image').attr('href', valkeyMark).attr('x', w - 26).attr('y', 8).attr('width', 18).attr('height', 18)
  }
  if (glyph === 'db') databaseGlyph(g, w - 30, 6, VK.red)
  if (glyph === 'gateway') gatewayGlyph(g, w - 30, 6, VK.purple)
  if (glyph === 'users') usersGlyph(g, w - 32, 6, VK.purple)
  const states = {
    idle: { stroke: VK.lavender, fill: VK.white, text: VK.black, lift: 0 },
    current: { stroke: VK.blue, fill: VK.current, text: VK.black, lift: -4 },
    good: { stroke: VK.blue, fill: VK.blueFill, text: VK.black, lift: 0 },
    down: { stroke: VK.red, fill: VK.redFill, text: VK.red, lift: 0 },
    warn: { stroke: VK.candy, fill: VK.redFill, text: VK.black, lift: 0 },
    faded: { stroke: VK.mist, fill: VK.cream, text: VK.muted, lift: 0 },
  }
  return {
    g,
    statusText,
    x, y, w, h,
    cx: x + w / 2,
    cy: y + h / 2,
    top: { x: x + w / 2, y },
    bottom: { x: x + w / 2, y: y + h },
    left: { x, y: y + h / 2 },
    right: { x: x + w, y: y + h / 2 },
    setState(state) {
      const s = states[state] || states.idle
      tr(rect, 260).attr('stroke', s.stroke).attr('fill', s.fill)
      tr(labelText, 260).attr('fill', s.text)
      tr(g, 260).attr('transform', `translate(${x},${y + s.lift})`)
    },
    setStatus(text, color = VK.muted) {
      statusText.text(text).attr('fill', color)
    },
    setLabel(text) {
      labelText.text(text)
    },
    setEyebrow(text, color = VK.purple) {
      eyebrowText.text(text).attr('fill', color)
    },
    show(visible = true) {
      tr(g, 260).attr('opacity', visible ? 1 : 0)
    },
  }
}

/** Cubic path from point a to point b bulging up (negative) or down (positive) by `bulge` px. */
export function arc(a, b, bulge = -60) {
  const mx = (a.x + b.x) / 2
  const c1 = { x: a.x + (mx - a.x) * 0.6, y: a.y + bulge }
  const c2 = { x: b.x - (b.x - mx) * 0.6, y: b.y + bulge }
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`
}

export function line(a, b) {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

/** Elbow path: horizontal then vertical then horizontal through midpoint x. */
export function elbow(a, b, midX) {
  const x = midX ?? (a.x + b.x) / 2
  return `M ${a.x} ${a.y} L ${x} ${a.y} L ${x} ${b.y} L ${b.x} ${b.y}`
}

/**
 * Draw a flow path that starts hidden (dash offset = length).
 * Controller: setState('hidden' | 'active' | 'current' | 'broken' | 'faded').
 */
export function flow(parent, d, { tone = 'blue', prefix = 'kit', width = 3, dashed = false } = {}) {
  const color = toneColor(tone)
  const path = parent.append('path').attr('d', d).attr('fill', 'none')
    .attr('stroke', color).attr('stroke-width', width).attr('stroke-linecap', 'round')
    .attr('marker-end', `url(#${prefix}-arrow-${tone})`).attr('opacity', 0)
  const length = path.node().getTotalLength()
  path.attr('stroke-dasharray', dashed ? `${length} ${length}` : length).attr('stroke-dashoffset', length)
  let current = 'hidden'
  const ctl = {
    path,
    node: path.node(),
    length,
    state: () => current,
    setState(state) {
      current = state
      if (state === 'hidden') {
        tr(path, 200).attr('opacity', 0).attr('stroke-dashoffset', length)
        return
      }
      const opacity = { active: 0.34, current: 1, broken: 0.9, faded: 0.14 }[state] ?? 1
      const strokeColor = state === 'broken' ? VK.red : color
      const w = state === 'current' ? width + 1 : width
      path.attr('stroke', strokeColor).attr('marker-end', `url(#${prefix}-arrow-${state === 'broken' ? 'red' : tone})`)
      if (state === 'broken') path.attr('stroke-dasharray', '9 8')
      else path.attr('stroke-dasharray', dashed ? '9 8' : length)
      tr(path, 520).attr('opacity', opacity).attr('stroke-width', w).attr('stroke-dashoffset', 0)
    },
  }
  return ctl
}

/** Animate a dot along a path; resolves when done. In static mode resolves immediately without drawing. */
export function particle(parent, pathNode, { tone = 'blue', duration = 650, r = 6, reverse = false } = {}) {
  if (isStatic()) return Promise.resolve()
  const length = pathNode.getTotalLength()
  const dot = parent.append('circle').attr('r', r).attr('fill', toneColor(tone)).attr('stroke', VK.white).attr('stroke-width', 2)
  const start = pathNode.getPointAtLength(reverse ? length : 0)
  dot.attr('transform', `translate(${start.x},${start.y})`)
  return new Promise((resolve) => {
    dot.transition().duration(duration).ease(d3.easeCubicInOut)
      .attrTween('transform', () => (t) => {
        const p = pathNode.getPointAtLength(reverse ? length * (1 - t) : length * t)
        return `translate(${p.x},${p.y})`
      })
      .transition().duration(160).attr('opacity', 0).remove()
      .on('end', resolve)
  })
}

/** Pill label. Controller: setState('hidden' | 'active' | 'current'). */
export function pill(parent, x, y, text, { tone = 'muted' } = {}) {
  const g = parent.append('g').attr('class', 'pill').attr('opacity', 0).attr('transform', `translate(${x},${y + 4})`)
  const label = g.append('text').attr('x', 0).attr('y', 0).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
    .attr('fill', VK.muted).attr('font-family', FONT_CODE).attr('font-size', 10).attr('font-weight', 700).text(text)
  const box = label.node().getBBox()
  const rect = g.insert('rect', 'text').attr('x', box.x - 8).attr('y', box.y - 4).attr('width', box.width + 16).attr('height', box.height + 8)
    .attr('rx', 999).attr('fill', VK.white).attr('stroke', VK.mist)
  return {
    g,
    setText(t) {
      label.text(t)
      const b = label.node().getBBox()
      rect.attr('x', b.x - 8).attr('y', b.y - 4).attr('width', b.width + 16).attr('height', b.height + 8)
    },
    setState(state) {
      if (state === 'hidden') {
        tr(g, 180).attr('opacity', 0).attr('transform', `translate(${x},${y + 4})`)
        return
      }
      const isCurrent = state === 'current'
      const color = isCurrent ? (tone === 'red' ? VK.red : VK.purple) : VK.muted
      label.attr('fill', color)
      rect.attr('stroke', isCurrent ? (tone === 'red' ? VK.red : VK.blue) : VK.mist)
      tr(g, 220).attr('opacity', isCurrent ? 1 : 0.55).attr('transform', `translate(${x},${y})`)
    },
  }
}

/** Horizontal gauge bar. Controller: set(value 0..1+, {tone}). Over 1 shows an overflow segment. */
export function gauge(parent, x, y, w, h = 8) {
  const g = parent.append('g').attr('transform', `translate(${x},${y})`)
  g.append('rect').attr('width', w).attr('height', h).attr('rx', h / 2).attr('fill', VK.mist)
  const fill = g.append('rect').attr('width', 0).attr('height', h).attr('rx', h / 2).attr('fill', VK.blue)
  const over = g.append('rect').attr('x', w - 2).attr('width', 0).attr('height', h).attr('rx', h / 2).attr('fill', VK.red).attr('opacity', 0)
  return {
    g,
    set(value, { tone = 'blue', duration = 600 } = {}) {
      const clamped = Math.max(0, Math.min(1, value))
      tr(fill, duration).attr('width', w * clamped).attr('fill', toneColor(tone))
      const overflow = Math.max(0, value - 1)
      tr(over, duration).attr('width', overflow > 0 ? Math.min(w * 0.35, 6 + overflow * 10) : 0).attr('opacity', overflow > 0 ? 1 : 0)
    },
  }
}

/** Tween a text element's number. */
export function countUp(textSel, to, { from, format = fmt, duration = 650, suffix = '' } = {}) {
  const start = from ?? (Number(String(textSel.text()).replace(/[^0-9.]/g, '')) || 0)
  if (isStatic()) {
    textSel.text(`${format(to)}${suffix}`)
    return
  }
  textSel.transition().duration(duration).ease(EASE).tween('text', function () {
    const i = d3.interpolateNumber(start, to)
    return (t) => d3.select(this).text(`${format(i(t))}${suffix}`)
  })
}

export function text(parent, x, y, content, { size = 13, color = VK.black, weight = 600, anchor = 'start', mono = false, opacity = 1 } = {}) {
  return parent.append('text').attr('x', x).attr('y', y).attr('text-anchor', anchor)
    .attr('fill', color).attr('font-family', mono ? FONT_CODE : FONT_BODY).attr('font-size', size).attr('font-weight', weight)
    .attr('opacity', opacity).text(content)
}

/** A small cylinder glyph for a database node. */
export function databaseGlyph(parent, x, y, color = VK.red) {
  const g = parent.append('g').attr('transform', `translate(${x},${y})`)
  g.append('path').attr('d', 'M0 4 v14 a10 4 0 0 0 20 0 v-14').attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2)
  g.append('ellipse').attr('cx', 10).attr('cy', 4).attr('rx', 10).attr('ry', 4).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2)
  g.append('path').attr('d', 'M0 11 a10 4 0 0 0 20 0').attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2)
  return g
}

/** A valve-like glyph for a gateway or limiter. */
export function gatewayGlyph(parent, x, y, color = VK.purple) {
  const g = parent.append('g').attr('transform', `translate(${x},${y})`)
  g.append('path').attr('d', 'M0 11 h6 l4 -7 l4 14 l4 -7 h4').attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2).attr('stroke-linejoin', 'round')
  g.append('rect').attr('x', -2).attr('y', 0).attr('width', 24).attr('height', 22).attr('rx', 3).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.5)
  return g
}

/** Three dots for a crowd of clients. */
export function usersGlyph(parent, x, y, color = VK.purple) {
  const g = parent.append('g').attr('transform', `translate(${x},${y})`)
  for (const [cx, cy] of [[4, 10], [12, 6], [20, 10]]) {
    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 3.2).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.6)
    g.append('path').attr('d', `M${cx - 5} ${cy + 10} a5 5 0 0 1 10 0`).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.6)
  }
  return g
}

export function stepBarSteps(steps, step) {
  const bounded = Math.min(Math.max(step, 0), steps.length - 1)
  return steps[bounded]
}
