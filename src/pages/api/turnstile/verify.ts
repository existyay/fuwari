import { TURNSTILE_SECRET_KEY } from "astro:env/server";
import type { APIRoute } from "astro";

const VERIFY_ENDPOINT =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";

const jsonResponse = (status: number, body: Record<string, unknown>) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json",
		},
	});

const getClientIp = (request: Request): string | null => {
	const connectingIp = request.headers.get("CF-Connecting-IP");
	if (connectingIp) {
		return connectingIp;
	}

	const forwardedFor = request.headers.get("x-forwarded-for");
	return forwardedFor ? (forwardedFor.split(",")[0]?.trim() ?? null) : null;
};

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const token = (await request.formData()).get("cf-turnstile-response");
	if (typeof token !== "string" || token.length === 0) {
		return jsonResponse(400, {
			success: false,
			message: "Missing Turnstile token",
		});
	}

	const secretKey = (TURNSTILE_SECRET_KEY ?? "").trim();
	if (!secretKey) {
		return jsonResponse(500, {
			success: false,
			message: "TURNSTILE_SECRET_KEY is not configured",
		});
	}

	const payload = new URLSearchParams();
	payload.set("secret", secretKey);
	payload.set("response", token);

	const clientIp = getClientIp(request);
	if (clientIp) {
		payload.set("remoteip", clientIp);
	}

	try {
		const result = await fetch(VERIFY_ENDPOINT, {
			method: "POST",
			body: payload,
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
		});

		const outcome = await result.json();

		if (!outcome.success) {
			return jsonResponse(400, {
				success: false,
				message: "Turnstile rejected the token",
				errors: outcome["error-codes"] ?? [],
			});
		}

		return jsonResponse(200, {
			success: true,
			challengeTs: outcome.challenge_ts ?? null,
			hostname: outcome.hostname ?? null,
		});
	} catch (error) {
		return jsonResponse(502, {
			success: false,
			message: "Failed to reach Cloudflare Turnstile",
			error: error instanceof Error ? error.message : String(error),
		});
	}
};

export const ALL: APIRoute = async () =>
	jsonResponse(405, {
		success: false,
		message: "Method not allowed",
	});
