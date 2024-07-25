const pool = require("../database/")

async function getCommentsByVehicleId(vehicle_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.comments AS c
        WHERE c.comment_vehicle_id = $1
        ORDER BY comment_date DESC`,
            [vehicle_id]
        )
        return data.rows
    } catch (error) {
        console.error("getCommentsByVehicleId error " + error)
    }
}

async function createComments(data) {
    try {
        const result = await pool.query(
            `INSERT INTO public.comments (comment_user, comment_text, comment_vehicle_id) VALUES ($1, $2, $3)`,
            [data.user,
            data.text,
            data.vehicle_id]
        );
        return true;
    } catch (error) {
        console.error("createComments error: " + error.message);
        throw error;
    }
}

module.exports = {
    getCommentsByVehicleId,
    createComments
}

