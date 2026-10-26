/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { generateRoomCode } from './roomService';

test('generateRoomCode produces a clean 6-7 character alphanumeric code', () => {
  for (let i = 0; i < 20; i++) {
    const code = generateRoomCode();
    assert.ok(code.length >= 6 && code.length <= 8, `Code length should be 6-8 chars, got ${code.length}`);
    assert.strictEqual(code, code.toUpperCase(), 'Code should be uppercase');
    assert.match(code, /^(NOS|AMOR|PAR|DOIS|LOVE)\d{3}$/, 'Code should match friendly prefix + 3 digits');
  }
});
