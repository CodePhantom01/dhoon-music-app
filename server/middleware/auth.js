const crypto = require("crypto");

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "change-me-in-production"
  );
}

function createAdminToken() {
  const payload = {
    role: "admin",
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");

  return `${data}.${sig}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== "string") {
    return false;
  }

  const [data, sig] = token.split(".");

  if (!data || !sig) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");

  if (sig.length !== expected.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    );

    if (payload.role !== "admin" || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = auth.slice(7);

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

module.exports = {
  createAdminToken,
  verifyAdminToken,
  requireAdmin,
};
