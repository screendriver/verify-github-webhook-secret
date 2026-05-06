import assert from "node:assert";
import http from "node:http";
import micro from "micro";
import listen from "test-listen";
import gotClient, { type Headers } from "got";
import { test } from "mocha";
import { verifySecret } from "../../src/index.ts";

type TestVerifySecretOptions = {
	readonly secret: string;
	readonly requestBodyJson: unknown;
	readonly xHubSignatureHeader?: string;
};

async function verifySecretForRequest(options: TestVerifySecretOptions): Promise<boolean> {
	const { secret, requestBodyJson, xHubSignatureHeader } = options;
	let isSignatureValid = false;

	const server = new http.Server(
		micro.serve(async (request) => {
			isSignatureValid = await verifySecret(request, secret);

			return "";
		})
	);

	try {
		const url = await listen(server);
		let headers: Headers | undefined;

		if (xHubSignatureHeader !== undefined) {
			headers = { "X-Hub-Signature": xHubSignatureHeader };
		}

		await gotClient.post(url, {
			headers,
			json: requestBodyJson
		});
	} finally {
		server.close();
	}
	return isSignatureValid;
}

test('returns "false" when "x-hub-signature" header is missing', async () => {
	const isSignatureValid = await verifySecretForRequest({ secret: "my-secret", requestBodyJson: {} });

	assert.strictEqual(isSignatureValid, false);
});

test('returns "false" when secret is wrong', async () => {
	const isSignatureValid = await verifySecretForRequest({
		secret: "wrong-secret",
		requestBodyJson: { foo: "bar" },
		xHubSignatureHeader: "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553"
	});

	assert.strictEqual(isSignatureValid, false);
});

test('returns "true" when secret is correct', async () => {
	const isSignatureValid = await verifySecretForRequest({
		secret: "my-secret",
		requestBodyJson: { foo: "bar" },
		xHubSignatureHeader: "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553"
	});

	assert.strictEqual(isSignatureValid, true);
});

test("should not hang when verify is called more than once", async () => {
	let isSignatureValid = false;

	const server = new http.Server(
		micro.serve(async (request) => {
			isSignatureValid = await verifySecret(request, "my-secret");
			await verifySecret(request, "my-secret");

			return "";
		})
	);

	try {
		const url = await listen(server);

		await gotClient.post(url, {
			headers: { "X-Hub-Signature": "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553" },
			json: { foo: "bar" }
		});
	} finally {
		server.close();
	}

	assert.strictEqual(isSignatureValid, true);
});
