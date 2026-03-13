const router = require('express').Router();
const db = require('../db');
const asyncHandler = require('../middleware/asyncHandler');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', asyncHandler(async(req, res)=> {
    const {rows} = await db.query(
        `SELECT * FROM applications
        WHERE user_id = $1
        ORDER BY created_at DESC`,
        [req.userId]
    );
    res.json(rows);
}));

router.post('/', asyncHandler(async(req, res) => {
    const {company, role, status, date_applied, link, notes, resume_label, resume_url} = req.body;

    if(!company || !role){
        return res.status(400).json({error: "Company and role are required"});
    }

    const {rows} = await db.query(
        `INSERT INTO applications (
            clerk_user_id, company, role, status, date_applied, link, notes, resume_label, resume_url)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [req.userId, company, role, status || 'Applied', date_applied || new Date(), link || null, notes || null, resume_label || null, resume_url || null]
    );
    
    res.status(201).json(rows[0]);
    
}));

//clerk_user_id = $10 prevents users editing each other's data
router.put('/:id', asyncHandler(async(req, res) => {
     const { company, role, status, date_applied, link, notes, resume_label, resume_url } = req.body;

     const{rows} = await db.query(
        `UPDATE applications
        SET company = $1, role = $2, status = $3, date_applied = $4, link = $5, notes = $6, resume_label = $7, resume_url = $8, updated_at = NOW()
        WHERE id = $9 AND clerk_user_id = $10
        RETURNING *`,
        [company, role, status, date_applied || null, link || null, notes || null, resume_label || null, resume_url || null, req.params.id, req.userId]
     );

     if(!rows[0]){
        return res.status(404).json({error: "Application not found"});
     }
     res.json(rows[0]);
}));

router.delete('/:id', asyncHandler(async(req, res) =>{
    const {rowCount} = await db.query(
        `DELETE FROM applications
        WHERE id = $1 AND clerk_user_id = $2`,
        [req.params.id, req.userId]
    );

    if(!rowCount){
        return res.status(404).json({error: "Application not found"});
    }

    res.json({success: true});
}))

module.exports = router;

