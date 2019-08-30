import { verify } from '../../src/verify';

const body = JSON.stringify({
  foo: 'bar',
});
const signature = 'sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553';

test('return "false" when signature is missing', () => {
  const valid = verify(body, 'my-secret');
  expect(valid).toBe(false);
});

test('return "false" when signature is an Array', () => {
  const valid = verify(body, 'wrong-secret', signature);
  expect(valid).toBe(false);
});

test('return "false" when secret is wrong', () => {
  const valid = verify(body, 'wrong-secret', signature);
  expect(valid).toBe(false);
});

test('return "true" when secret is correct', () => {
  const valid = verify(body, 'my-secret', signature);
  expect(valid).toBe(true);
});
