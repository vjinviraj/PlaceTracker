const { getAuth } = require("@clerk/express");

/**
 * Middleware that verifies the Clerk session token.
 * Attaches userId to req.auth if valid.
 * Returns 401 if missing or invalid.
 */
function requireAuth(req, res, next) {
  const auth = getAuth(req);

  if (!auth || !auth.userId) {
    return res.status(401).json({ error: "Unauthorised — please sign in" });
  }

  // Make userId easily accessible in route handlers
  req.userId = auth.userId;
  next();
}

module.exports = requireAuth;