import pool from '../js/databaseconfig.js';

async function healthCheck(){
    const res = await pool.query('SELECT 1 AS ok;');
    console.log(res.rows);
    await pool.end();
}

healthCheck().catch(err => {
    console.error('DB health check failed: ', err.message);
    process.exit(1);
});