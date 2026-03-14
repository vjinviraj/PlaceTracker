const router = require("express").Router();
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");
const asyncHandler = require("../middleware/asyncHandler");
 
router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM calendar_events 
     WHERE clerk_user_id = $1 
     ORDER BY date ASC, time ASC`,
    [req.userId]
  );
  res.json(rows);
}));

router.post("/", asyncHandler(async (req, res) => {
  const { title, company, type, date, time, notes } = req.body;
  if (!title || !date) return res.status(400).json({ error: "Title and date are required" });
 
  const { rows } = await db.query(
    `INSERT INTO calendar_events (clerk_user_id, title, company, type, date, time, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [req.userId, title, company || null, type || "Other", date, time || null, notes || null]
  );
  res.status(201).json(rows[0]);
}));

router.put("/:id", asyncHandler(async (req, res) => {
  const { title, company, type, date, time, notes } = req.body;
 
  const { rows } = await db.query(
    `UPDATE calendar_events 
     SET title=$1, company=$2, type=$3, date=$4, time=$5, notes=$6
     WHERE id=$7 AND clerk_user_id=$8
     RETURNING *`,
    [title, company || null, type || "Other", date, time || null, notes || null, req.params.id, req.userId]
  );
 
  if (!rows[0]) return res.status(404).json({ error: "Event not found" });
  res.json(rows[0]);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const { rowCount } = await db.query(
    `DELETE FROM calendar_events WHERE id=$1 AND clerk_user_id=$2`,
    [req.params.id, req.userId]
  );
  if (!rowCount) return res.status(404).json({ error: "Event not found" });
  res.json({ success: true });
}));

module.exports = router;