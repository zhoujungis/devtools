import { describe,it,expect } from 'vitest'
import { formatJson } from '../src/tools/json-formatter/processor'
describe('placeholder',()=>{it('works',()=>{expect(formatJson('{"ok":true}').valid).toBe(true)})})
