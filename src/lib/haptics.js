// Micro-haptics for touch devices. Vibration lengths are kept extremely short
// so they read as texture, not notification. Silently no-ops where the
// Vibration API is unsupported (all desktop browsers, iOS Safari).

function vibrate(ms) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  try {
    navigator.vibrate(ms)
  } catch {
    // Some browsers throw outside a user gesture — never let haptics break UI.
  }
}

// Button press / navigation tap.
export const tapHaptic = () => vibrate(8)

// Successful form submit — a touch longer, still subtle.
export const successHaptic = () => vibrate([10, 30, 10])
