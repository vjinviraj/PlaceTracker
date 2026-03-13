const express = require("express");
const { clerkClient } = require("@clerk/express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

/**
 * GET /api/user/me
 * Returns the current user's profile from Clerk.
 * Frontend uses this to get name + email after login.
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.userId);

    res.json({
      id: user.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.emailAddresses[0]?.emailAddress || "",
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("GET /api/user/me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * PATCH /api/user/me
 * Updates the user's name in Clerk.
 */
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName) {
      return res.status(400).json({ error: "First name is required" });
    }

    const updated = await clerkClient.users.updateUser(req.userId, {
      firstName,
      lastName: lastName || "",
    });

    res.json({
      id: updated.id,
      name: `${updated.firstName || ""} ${updated.lastName || ""}`.trim(),
      email: updated.emailAddresses[0]?.emailAddress || "",
    });
  } catch (err) {
    console.error("PATCH /api/user/me error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

/**
 * DELETE /api/user/me
 * Deletes the user's Clerk account entirely.
 * When you add the DB later, also delete their data here.
 */
router.delete("/me", requireAuth, async (req, res) => {
  try {
    await clerkClient.users.deleteUser(req.userId);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/user/me error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

module.exports = router;