export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  return res.status(200).json({
    success: true,
    service: "TeacherMate Kenya M-Pesa API",
    environment: process.env.DARAJA_ENV || "not-configured",
    message: "Payment API endpoint is reachable."
  });
}
