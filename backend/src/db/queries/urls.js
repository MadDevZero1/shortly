export function repository(db) {
  return {
    health: () => db.query('SELECT 1'),
    async insert(owner, code, url) { return (await db.query('INSERT INTO urls(owner_id, short_code, long_url) VALUES ($1,$2,$3) RETURNING *', [owner, code, url])).rows[0]; },
    async find(code, owner) { return (await db.query('SELECT * FROM urls WHERE short_code=$1 AND owner_id=$2', [code, owner])).rows[0]; },
    async remove(code, owner) { return (await db.query('DELETE FROM urls WHERE short_code=$1 AND owner_id=$2 RETURNING short_code', [code, owner])).rows[0]; },
    async destination(code) { return (await db.query('SELECT id, long_url FROM urls WHERE short_code=$1', [code])).rows[0]; },
    click: (id, host) => db.query('INSERT INTO clicks(url_id,referrer) VALUES ($1,$2)', [id,host]),
    async list(owner, {page,limit,q}) {
      const pattern = `%${q.replace(/[\\%_]/g, '\\$&')}%`;
      const filter = "owner_id=$1 AND (long_url ILIKE $2 ESCAPE '\\' OR short_code ILIKE $2 ESCAPE '\\')";
      const total = (await db.query(`SELECT COUNT(*)::text AS total FROM urls WHERE ${filter}`, [owner,pattern])).rows[0].total;
      const { rows } = await db.query(`SELECT u.*, (SELECT COUNT(*)::text FROM clicks c WHERE c.url_id=u.id) AS total_clicks FROM urls u WHERE ${filter} ORDER BY created_at DESC,id DESC LIMIT $3 OFFSET $4`, [owner,pattern,limit,(page-1)*limit]);
      return { rows, total };
    },
    async summary(owner) { return (await db.query('SELECT (SELECT COUNT(*)::text FROM urls WHERE owner_id=$1) AS "totalUrls", (SELECT COUNT(*)::text FROM clicks c JOIN urls u ON u.id=c.url_id WHERE u.owner_id=$1) AS "totalClicks"', [owner])).rows[0]; },
    async stats(id) {
      const total = (await db.query('SELECT COUNT(*)::text AS total FROM clicks WHERE url_id=$1', [id])).rows[0].total;
      const days = (await db.query(`WITH days AS (SELECT generate_series((NOW() AT TIME ZONE 'UTC')::date-29,(NOW() AT TIME ZONE 'UTC')::date,'1 day'::interval)::date AS day), counts AS (SELECT (clicked_at AT TIME ZONE 'UTC')::date AS day,COUNT(*) AS clicks FROM clicks WHERE url_id=$1 AND clicked_at >= (((NOW() AT TIME ZONE 'UTC')::date-29)::timestamp AT TIME ZONE 'UTC') GROUP BY 1) SELECT to_char(days.day,'YYYY-MM-DD') AS date,COALESCE(counts.clicks,0)::text AS clicks FROM days LEFT JOIN counts USING(day) ORDER BY days.day`, [id])).rows;
      const refs = (await db.query("SELECT COALESCE(referrer,'direct') AS referrer,COUNT(*)::text AS clicks FROM clicks WHERE url_id=$1 GROUP BY 1 ORDER BY COUNT(*) DESC,1 ASC LIMIT 10", [id])).rows;
      const recent = (await db.query('SELECT clicked_at AS "clickedAt",COALESCE(referrer,\'direct\') AS referrer FROM clicks WHERE url_id=$1 ORDER BY clicked_at DESC,id DESC LIMIT 20', [id])).rows;
      return { totalClicks: total, clicksPerDay: days, topReferrers: refs, recentClicks: recent };
    }
  };
}
