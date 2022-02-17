import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { rehype } from 'rehype'
import dedent from 'dedent'
import rehypePrism from './index.js'

const processHtml = (html) =>
  rehype()
    .data('settings', { fragment: true })
    .use(rehypePrism)
    .processSync(html)
    .toString()

test('finds code and highlights', () => {
  const html = dedent`
    <div>
      <p>foo</p>
      <pre><code class="language-js">const x = 8</code></pre>
    </div>`
  const expected = dedent`
    <div>
      <p>foo</p>
      <pre><code class="language-js"><span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token number">8</span></code></pre>
    </div>`

  assert.is(processHtml(html), expected)
})

test('handles uppercase languages correctly', () => {
  const html = dedent`<pre><code class="language-JS">const x = 8</code></pre>`
  const expect = dedent`<pre><code class="language-JS"><span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token number">8</span></code></pre>`

  assert.is(processHtml(html), expect)
})

test.run()
