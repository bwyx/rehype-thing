import rangeParser from 'parse-numeric-range'

/**
 * @returns { (line: number) => boolean }
 */
export const calcLinesToHighlight = (meta) => {
  const RE = /{([\d, -]+)}/
  const highlightMeta = RE.exec(meta)
  if (!highlightMeta) return () => false

  const strLineNumbers = highlightMeta[1].replace(' ', '')
  const lineNumbers = rangeParser(strLineNumbers)
  if (!lineNumbers.length) return null

  return (line) => lineNumbers.map((lineNumber) => lineNumber).includes(line)
}

const highlightLine = (node) => {
  if (!node.data || !node.data.meta) return
  console.log({ node })
}

export default highlightLine
