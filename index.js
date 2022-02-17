import { refractor } from 'refractor'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'

const getLanguage = (node) => {
  const lang = node.properties.className.find((className) =>
    className.startsWith('language-')
  )
  return lang ? lang.slice(9) : null
}

export default function () {
  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') return

    const lang = getLanguage(node)

    const highlighted = refractor.highlight(toString(node), lang)

    node.children = highlighted.children
  }
}
