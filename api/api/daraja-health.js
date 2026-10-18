
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  const key = process.env.DARAJA_CONSUMER_KEY;
  const secret = process.env.DARAJA_CONSUMER_SECRET;
  const env = process.env.DARAJA_ENV;

  if (!key || !secret || !env) {
    return res.status(500).json({
      success: false,
      message: "Daraja configuration is incomplete."
    });
  }

  if (env !== "sandbox") {
    return res.status(400).json({
      success: false,
      message: "This diagnostic only allows sandbox."
    });
  }

  try {
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Daraja sandbox authentication failed. Check your app credentials."
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: Boolean(data.access_token),
      message: data.access_token
        ? "Daraja sandbox authentication successful."
        : "Daraja did not return an access token."
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Could not reach Daraja sandbox."
    });
  }
}
