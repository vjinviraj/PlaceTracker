// Wraps async route handlers so any thrown error
// is automatically passed to Express's error handler.
// Without this, unhandled async errors crash Express silently.
//
// Usage: router.get("/", asyncHandler(async (req, res) => { ... }))
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};