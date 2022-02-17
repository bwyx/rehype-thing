import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { rehype } from 'rehype'
import dedent from 'dedent'

import highlightCode from '../src/highlightCode'

const processHtml = (html, options) =>
  rehype()
    .data('settings', { fragment: true })
    .use(highlightCode, options)
    .processSync(html)
    .toString()

const rawJS = 'const x = 8'
const highlightedJS =
  '<span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token number">8</span>'

test('finds code and highlights', () => {
  const html = dedent`
    <div>
      <p>foo</p>
      <pre><code class="language-js">${rawJS}</code></pre>
    </div>`
  const expected = dedent`
    <div>
      <p>foo</p>
      <pre><code class="language-js">${highlightedJS}</code></pre>
    </div>`

  assert.is(processHtml(html), expected)
})

test('handles uppercase languages correctly', () => {
  const html = dedent`<pre><code class="language-JS">${rawJS}</code></pre>`
  const expected = dedent`<pre><code class="language-JS">${highlightedJS}</code></pre>`

  assert.is(processHtml(html), expected)
})

test('does nothing to code block without language- class', () => {
  const html = dedent`<pre><code>${rawJS}</code></pre>`

  assert.is(processHtml(html), html)
})

test('throw error with fake language- class', () => {
  assert.throws(() => {
    processHtml(
      dedent`<pre><code class="language-thisisnotalanguage">${rawJS}</code></pre>`
    )
  })
})

test('with options.ignoreMissing, does nothing to code block with fake language- class', () => {
  const html = dedent`<pre><code class="language-thisisnotalanguage">${rawJS}</code></pre>`

  assert.is(processHtml(html, { ignoreMissing: true }), html)
})

test.run()
