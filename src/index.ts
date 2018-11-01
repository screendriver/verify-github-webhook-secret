import { IncomingMessage } from 'http';
import { text } from 'micro';
import { verifySecret } from './verify';

export = async (req: IncomingMessage, secret: string): Promise<boolean> => {
  const signature = req.headers['x-hub-signature'];
  const body = await text(req);
  return verifySecret(body, secret, signature);
};
