
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return res.status(500).json({
      success: false,
      message: "Database environment variables are missing."
    });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(["PING"])
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Database connection failed."
      });
    }

    const result = await response.json();

    if (result.result !== "PONG") {
      return res.status(502).json({
        success: false,
        message: "Unexpected database response."
      });
    }

    return res.status(200).json({
      success: true,
      message: "TeacherMate Kenya database connected."
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Could not connect to the database."
    });
  }
}
