import test from 'tape';
import { IncomingMessage } from 'http';
import verifySecret = require('../../src/index');

test('should return false when "x-hub-signature" is missing', async t => {
  t.plan(1);
  const req: Partial<IncomingMessage> = {
    headers: {},
  };
  const secret = '';
  const valid = await verifySecret(req as IncomingMessage, secret);
  t.false(valid);
});
