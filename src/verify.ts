import { createHmac } from "crypto";

export function verify(body: string, secret: string, signature?: string | string[]): boolean {
	if (!signature) {
		return false;
	}
	const hmac = createHmac("sha1", secret);
	hmac.update(body);
	const calculated = `sha1=${hmac.digest("hex")}`;
	return signature === calculated;
}
