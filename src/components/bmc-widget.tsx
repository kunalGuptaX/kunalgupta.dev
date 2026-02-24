'use client'

import { useEffect } from 'react'

/**
 * Buy Me a Coffee floating widget.
 *
 * The BMC widget wraps its init in DOMContentLoaded, which has already fired
 * by the time React hydrates. We manually create the floating button instead
 * of relying on their script's event listener.
 */
export function BmcWidget() {
  useEffect(() => {
    if (document.getElementById('bmc-wbtn')) return

    const BMC_ID = 'kunalguptax'
    const BMC_COLOR = '#FF5F5F'
    const POSITION = 'Right'
    const X_MARGIN = 18
    const Y_MARGIN = 18

    const btn = document.createElement('div')
    btn.id = 'bmc-wbtn'
    Object.assign(btn.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      background: BMC_COLOR,
      color: 'white',
      borderRadius: '32px',
      position: 'fixed',
      [POSITION === 'Right' ? 'right' : 'left']: `${X_MARGIN}px`,
      bottom: `${Y_MARGIN}px`,
      boxShadow: '0 4px 8px rgba(0,0,0,.15)',
      zIndex: '9999',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    })

    const img = document.createElement('img')
    img.src = '/bmc-coffee-cup.svg'
    img.alt = 'Buy Me A Coffee'
    Object.assign(img.style, { height: '36px', width: '36px', margin: '0', padding: '0' })
    btn.appendChild(img)

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)'
      btn.style.boxShadow = '0 6px 14px rgba(0,0,0,.25)'
    })
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)'
      btn.style.boxShadow = '0 4px 8px rgba(0,0,0,.15)'
    })
    btn.addEventListener('click', () => {
      window.open(`https://www.buymeacoffee.com/${BMC_ID}`, '_blank')
    })

    document.body.appendChild(btn)

    return () => {
      btn.remove()
    }
  }, [])

  return null
}
