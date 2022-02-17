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
  const className = node.properties.className
  const lang =
    className &&
    // @ts-ignore
    className.find((className) => className.startsWith('language-'))
  return lang ? lang.slice(9).toLowerCase() : null
}

/**
 * @param {{ignoreMissing?: boolean}} options
 * @returns {(tree: Element) => void}
 */
export default function (options = {}) {
  return (tree) => {
    visit(tree, 'element', visitor)
  }

  /**
   * @param {Element} node
   * @param {number} index
   * @param {Element} parent
   */
  function visitor(node, index, parent) {
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

    node.children = refractorRoot.children
  }
}
