const router = require("express").Router();
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");
const asyncHandler = require("../middleware/asyncHandler");

router.use(requireAuth);

router.get("/", asyncHandler(async(req, res) => {
    const {rows : categories} = await db.query(
        `SELECT * FROM roadmap_categories
        WHERE clerk_user_id = $1
        ORDER BY created_at ASC`,
        [req.userId]
    );

    const {rows : topics} =  await db.query(
        `SELECT * FROM roadmap_topics
        WHERE clerk_user_id = $1
        ORDER BY sort_order ASC, created_at ASC`,
        [req.userId]

    );
    const result = categories.map(cat => ({
        ...cat,
        topics: topics.filter(t => t.category_id === cat.id),
    }));

    res.json(result);
}));

router.post('/categories', asyncHandler(async(req, res) =>{
    const {title, emoji, sort_order} = req.body;
    if(!title){
        return res.status(400).json({error: "Title is required"});
    }
    const {rows} = await db.query(
        `INSERT INTO roadmap_categories(clerk_user_id, title, emoji, sort_order)
        VALUES($1, $2, $3, $4) RETURNING *`,
        [req.userId, title, emoji || "📁", sort_order || 0]
    );

    res.status(201).json({...rows[0], topics: []});
}));

router.put('/categories/:id', asyncHandler(async(req, res) => {
    const {title, emoji, sort_order} = req.body;
    const {rows} = await db.query(
        `UPDATE roadmap_categories
        SET title = $1, emoji = $2, sort_order = $3
        WHERE id = $4 AND clerk_user_id = $5
        RETURNING *`,
        [title, emoji || "📁", sort_order || 0, req.params.id, req.userId]
    );

    if(!rows[0]){
        return res.status(404).json({error: "Category not found"});
    }

    res.json(rows[0]);
}));

//deleting category automatically deletes topics in that category
router.delete('/categories/:id', asyncHandler(async(req, res)=> {

    const {rowCount} = await db.query(
        `DELETE FROM roadmap_categories
        WHERE id = $1 AND clerk_user_id = $2`,
        [req.params.id, req.userId]
    );
    if(!rowCount){
        return res.status(404).json({error: "Category not found"});
    }
    res.json({success: true});  
}));

router.post('/topics', asyncHandler(async(req, res) => {

    const{category_id, title, status, sort_order} = req.body;

    if(!category_id || !title){
        return res.status(400).json({error: "Category and title are required"});
    }
    const {rows} = await db.query(`INSERT INTO roadmap_topics (category_id, clerk_user_id, title, status, sort_order)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`, [category_id, req.userId, title, status || 'not_started', sort_order || 0]);

     res.status(201).json(rows[0]);
}));

router.put('/topics/:id', asyncHandler(async(req, res)=>{
    const{title, status, sort_order} = req.body;

    const{rows} = await db.query(
        `UPDATE roadmap_topics
        SET title = $1, status = $2, sort_order = $3
        WHERE id = $4 AND clerk_user_id = $5
        RETURNING *`,
        [title, status || 'not_started', sort_order || 0, req.params.id, req.userId]
    );

    if(!rows[0]){
        return res.status(404).json({error: "Topic not found"});
    }

    res.json(rows[0]);
}));

router.put("/topics/:id", asyncHandler(async (req, res) => {
  const { title, status, sort_order } = req.body;
 
  const { rows } = await db.query(
    `UPDATE roadmap_topics 
     SET title=$1, status=$2, sort_order=$3
     WHERE id=$4 AND clerk_user_id=$5
     RETURNING *`,
    [title, status || "not_started", sort_order || 0, req.params.id, req.userId]
  );
 
  if (!rows[0]) return res.status(404).json({ error: "Topic not found" });
  res.json(rows[0]);
}));

router.delete("/topics/:id", asyncHandler(async (req, res) => {
  const { rowCount } = await db.query(
    `DELETE FROM roadmap_topics WHERE id=$1 AND clerk_user_id=$2`,
    [req.params.id, req.userId]
  );
  if (!rowCount) return res.status(404).json({ error: "Topic not found" });
  res.json({ success: true });
}));

module.exports = router;
