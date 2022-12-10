import { test } from "uvu";
import * as assert from "uvu/assert";
import micro from "micro";
import listen from "test-listen";
import got from "got";
import { verifySecret } from "../../src/index";

test('return "false" when "x-hub-signature" header is missing', async () => {
	let assertionCalled = false;

	const server = micro(async (req) => {
		const valid = await verifySecret(req, "my-secret");
		assert.equal(valid, false);
		assertionCalled = true;
		return "";
	});
	const url = await listen(server);
	await got(url, {
		method: "POST",
		json: true,
		body: {},
	});
	server.close();

	assert.equal(assertionCalled, true);
});

test('return "false" when secret is wrong', async () => {
	let assertionCalled = false;

	const server = micro(async (req) => {
		const valid = await verifySecret(req, "wrong-secret");
		assert.equal(valid, false);
		assertionCalled = true;
		return "";
	});
	const url = await listen(server);
	await got(url, {
		method: "POST",
		headers: {
			"X-Hub-Signature": "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553",
		},
		json: true,
		body: {
			foo: "bar",
		},
	});
	server.close();

	assert.equal(assertionCalled, true);
});

test('return "true" when secret is correct', async () => {
	let assertionCalled = false;

	const server = micro(async (req) => {
		const valid = await verifySecret(req, "my-secret");
		assert.equal(valid, true);
		assertionCalled = true;
		return "";
	});
	const url = await listen(server);
	await got(url, {
		method: "POST",
		headers: {
			"X-Hub-Signature": "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553",
		},
		json: true,
		body: {
			foo: "bar",
		},
	});
	server.close();

	assert.equal(assertionCalled, true);
});

test("should not hang when verify is called more than once", async () => {
	let assertionCalled = false;

	const server = micro(async (req) => {
		const valid = await verifySecret(req, "my-secret");
		await verifySecret(req, "my-secret");
		assert.equal(valid, true);
		assertionCalled = true;
		return "";
	});
	const url = await listen(server);
	await got(url, {
		method: "POST",
		headers: {
			"X-Hub-Signature": "sha1=30a233839fe2ddd9233c49fd593e8f1aec68f553",
		},
		json: true,
		body: {
			foo: "bar",
		},
	});
	server.close();

	assert.equal(assertionCalled, true);
});

test.run();
