import test from 'ava';
import { verify } from '../../src/verify';

const body = JSON.stringify({
    foo: 'bar',
});
const signature = 'sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553';

test('return "false" when signature is missing', (t) => {
    const valid = verify(body, 'my-secret');
    t.false(valid);
});

test('return "false" when signature is an Array', (t) => {
    const valid = verify(body, 'wrong-secret', signature);
    t.false(valid);
});

test('return "false" when secret is wrong', (t) => {
    const valid = verify(body, 'wrong-secret', signature);
    t.false(valid);
});

test('return "true" when secret is correct', (t) => {
    const valid = verify(body, 'my-secret', signature);
    t.true(valid);
});
