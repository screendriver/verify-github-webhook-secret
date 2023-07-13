import { IncomingMessage } from "http";
import { text } from "micro";
import { verify } from "./verify.js";

export async function verifySecret(req: IncomingMessage, secret: string): Promise<boolean>;
export async function verifySecret(body: string, secret: string, xHubSignature?: string | string[]): Promise<boolean>;
export async function verifySecret(
	reqOrBody: IncomingMessage | string,
	secret: string,
	xHubSignature?: string | string[]
): Promise<boolean> {
	let body: string;
	let signature: string | string[] | undefined;
	if (typeof reqOrBody === "string") {
		body = reqOrBody;
		signature = xHubSignature;
	} else {
		body = await text(reqOrBody);
		signature = reqOrBody.headers["x-hub-signature"];
	}

	return verify(body, secret, signature);
}
