import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { calcLinesToHighlight } from '../src/highlightLine.js'

test('should parse meta correctly', () => {
  const meta = 'anotherMeta {3, 5-7} moreMeta'
  const lines = [2, 4, 5, 6]
  const shouldHighlight = calcLinesToHighlight(meta)
  lines.map((index) => assert.is(shouldHighlight(index + 1), true))
})

test.run()
