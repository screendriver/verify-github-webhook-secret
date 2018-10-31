import { IncomingMessage } from 'http';
import crypto from 'crypto';
import parse from 'co-body';

export = async function verifySecret(
  req: IncomingMessage,
  secret: string,
): Promise<boolean> {
  const signature = req.headers['x-hub-signature'];
  if (!signature) {
    return false;
  }
  const body = await parse.text(req);
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(body);
  const calculated = `sha1=${hmac.digest('hex')}`;
  return signature === calculated;
};
