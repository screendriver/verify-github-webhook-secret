import crypto from 'crypto';

export function verifySecret(
  body: string,
  secret: string,
  signature?: string,
): boolean {
  if (!signature) {
    return false;
  }
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(body);
  const calculated = `sha1=${hmac.digest('hex')}`;
  return signature === calculated;
}
