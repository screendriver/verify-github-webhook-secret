import { IncomingMessage } from 'http';
import { text } from 'micro';
import { verifySecret } from './verify';

async function run(req: IncomingMessage, secret: string): Promise<boolean>;
async function run(
  body: string,
  secret: string,
  xHubSignature?: string | string[],
): Promise<boolean>;
async function run(
  reqOrBody: IncomingMessage | string,
  secret: string,
  xHubSignature?: string | string[],
) {
  let body: string;
  let signature: string | string[] | undefined;
  if (typeof reqOrBody === 'string') {
    body = reqOrBody;
    signature = xHubSignature;
  } else {
    body = await text(reqOrBody);
    signature = reqOrBody.headers['x-hub-signature'];
  }
  return verifySecret(body, secret, signature);
}

export = run;
