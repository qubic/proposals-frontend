const formatString = (string: string | number | undefined | null) => {
  if (string === undefined || string === null) return '0'

  if (!Number.isNaN(Number(string)))
    return Number(string).toLocaleString('en-US', {
      maximumFractionDigits: 2
    })

  return String(string)
}

function formatEllipsis(str = '') {
  if (str.length > 10) {
    return `${str.slice(0, 5)}...${str.slice(-5)}`
  }
  return str
}

function formatBase64(hex: string | undefined) {
  if (hex) {
    const bytes = hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    const uint8Array = new Uint8Array(bytes)
    const byteArray = Array.from(uint8Array)
    const byteString = String.fromCharCode.apply(null, byteArray)
    const base64String = btoa(byteString)
    return base64String
  }
  return ''
}

function copyText(textToCopy: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // Use the modern clipboard API if available and secure
    navigator.clipboard.writeText(textToCopy)
  } else {
    const input = document.createElement('input')
    input.value = textToCopy
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
}

function pasteText(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use the modern clipboard API if available and secure
      navigator.clipboard.readText().then(
        (text) => resolve(text),
        (err) => reject(err)
      )
    } else {
      // Fallback if clipboard API is not available
      const input = document.createElement('textarea')
      input.style.position = 'fixed'
      input.style.left = '-9999px'
      document.body.appendChild(input)
      input.focus()
      document.execCommand('paste')
      const pastedText = input.value
      document.body.removeChild(input)
      if (pastedText) {
        resolve(pastedText)
      } else {
        reject(new Error('Unable to paste from clipboard'))
      }
    }
  })
}

export * from './date'
export * from './styles'
export { copyText, formatBase64, formatEllipsis, formatString, pasteText }
