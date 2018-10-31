import crypto from 'crypto';
import { IncomingMessage } from 'http';
import { text } from 'micro';

export = async function verifySecret(
  req: IncomingMessage,
  secret: string,
): Promise<boolean> {
  const signature = req.headers['x-hub-signature'];
  if (!signature) {
    return false;
  }
  const body = await text(req);
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(body);
  const calculated = `sha1=${hmac.digest('hex')}`;
  return signature === calculated;
};
