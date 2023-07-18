import test from "ava";
import http from "node:http";
import type { OutgoingHttpHeaders } from "node:http";
import micro from "micro";
import listen from "test-listen";
import got from "got";
import { verifySecret } from "../../src/index";

interface TestVerifySecretOptions {
	readonly secret: string;
	readonly requestBodyJson: object;
	readonly xHubSignatureHeader?: string;
}

const testVerifySecretMacro = test.macro(async (t, options: TestVerifySecretOptions, isValid: boolean) => {
	const { secret, requestBodyJson, xHubSignatureHeader } = options;

	const server = new http.Server(
		micro.serve(async (request) => {
			const valid = await verifySecret(request, secret);

			t.is(valid, isValid);

			return "";
		}),
	);

	try {
		const url = await listen(server);
		let headers: OutgoingHttpHeaders | undefined;

		if (xHubSignatureHeader !== undefined) {
			headers = { "X-Hub-Signature": xHubSignatureHeader };
		}

		await got.post(url, {
			headers,
			json: true,
			body: requestBodyJson,
		});
	} finally {
		server.close();
	}
});

test(
	'returns "false" when "x-hub-signature" header is missing',
	testVerifySecretMacro,
	{ secret: "my-secret", requestBodyJson: {} },
	false,
);

test(
	'returns "false" when secret is wrong',
	testVerifySecretMacro,
	{
		secret: "wrong-secret",
		requestBodyJson: { foo: "bar" },
		xHubSignatureHeader: "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553",
	},
	false,
);

test(
	'returns "true" when secret is correct',
	testVerifySecretMacro,
	{
		secret: "my-secret",
		requestBodyJson: { foo: "bar" },
		xHubSignatureHeader: "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553",
	},
	true,
);

test("should not hang when verify is called more than once", async (t) => {
	const server = new http.Server(
		micro.serve(async (request) => {
			const valid = await verifySecret(request, "my-secret");
			await verifySecret(request, "my-secret");

			t.true(valid);

			return "";
		}),
	);

	try {
		const url = await listen(server);

		await got.post(url, {
			headers: { "X-Hub-Signature": "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553" },
			json: true,
			body: { foo: "bar" },
		});
	} finally {
		server.close();
	}
});
