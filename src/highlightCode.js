import { refractor } from 'refractor'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'

/**
 * @typedef {import('hast').Element} Element
 */

/**
 * @param {Element} node
 * @returns {string|null}
 */
const getLanguage = (node) => {
  const { className } = node.properties
  const lang =
    className &&
    // @ts-ignore
    className.find((c) => c.startsWith('language-'))
  return lang ? lang.slice(9).toLowerCase() : null
}

/**
 * @param {{ignoreMissing?: boolean}} options
 * @returns {(tree: Element) => void}
 */
const highlightCode = (options = {}) => {
  /**
   * @param {Element} node
   * @param {number} index
   * @param {Element} parent
   */
  const visitor = (node, index, parent) => {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') return

    const lang = getLanguage(node)
    if (!lang) return

    // Syntax highlight
    let refractorRoot
    try {
      refractorRoot = refractor.highlight(toString(node), lang)
    } catch (err) {
      if (options.ignoreMissing && /Unknown language/.test(err.message)) return

      throw err
    }

    // eslint-disable-next-line no-param-reassign
    node.children = refractorRoot.children
  }

  return (tree) => {
    visit(tree, 'element', visitor)
  }
}

export default highlightCode
