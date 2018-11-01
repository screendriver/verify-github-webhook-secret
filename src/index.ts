import { IncomingMessage } from 'http';
import parse from 'co-body';
import { verifySecret } from './verify';

export = async (req: IncomingMessage, secret: string): Promise<boolean> => {
  const signature = req.headers['x-hub-signature'];
  const body = await parse.text(req);
  return verifySecret(body, secret, signature);
};
