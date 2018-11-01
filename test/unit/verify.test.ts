import test from 'tape';
import { verifySecret } from '../../src/verify';

const body = JSON.stringify({
  foo: 'bar',
});
const signature = 'sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553';

test('return "false" when signature is missing', t => {
  t.plan(1);
  const valid = verifySecret(body, 'my-secret');
  t.false(valid);
});

test('return "false" when signature is an Array', t => {
  t.plan(1);
  const valid = verifySecret(body, 'wrong-secret', signature);
  t.false(valid);
});

test('return "false" when secret is wrong', t => {
  t.plan(1);
  const valid = verifySecret(body, 'wrong-secret', signature);
  t.false(valid);
});

test('return "true" when secret is correct', t => {
  t.plan(1);
  const valid = verifySecret(body, 'my-secret', signature);
  t.true(valid);
});
