import test from 'tape';
import { testMe } from '../../src/index';

test('should work', t => {
  t.plan(1);
  t.is(testMe(), 123);
});
