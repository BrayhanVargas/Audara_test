const pool = require("../config/db");

module.exports = {
  showCallRate: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM rates WHERE id = ${id}`);
      return result;
    } catch (error) {
      return error;
    }
  },
  getCallRatesList: async ({
    whereQuery,
    whereParam,
    perpage,
    page,
    orderField,
    order,
  }) => {
    try {
      const result = await pool.query(
        `SELECT 
            r.id,
            IFNULL(r.name, '') as name,
            IFNULL(r.prefix, '') as prefix,
            IFNULL(r.status, '') as status,
            IFNULL(r.sec_rate, '') as sec_rate,
            IFNULL(r.min_rate, '') as min_rate
            FROM rates r
            LEFT JOIN currencies ON currencies.id = r.currency_id
            ${whereQuery}
            GROUP BY r.id
            ORDER BY ${orderField} ${order} 
            LIMIT ? 
            OFFSET ?`,
        [...whereParam, perpage, (page - 1) * perpage]
      );
      delete result["meta"];
      return result;
    } catch (error) {
      return error;
    }
  },
  createCallRate: async (data) => {
    try {
      const result = await pool.query(
        `INSERT INTO rates (name, prefix, number_of_digits, min_rate, sec_rate, currency_id, status) 
        VALUES (?,?,?,?,?,?,?)`,
        Object.values(data)
      );
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  updateCallRate: async (data) => {
    try {
      const result = await pool.query(
        `UPDATE rates SET name = ?, prefix = ?, number_of_digits = ?, min_rate = ?, sec_rate = ?, currency_id = ?, status = ? 
        WHERE id = ?`,
        Object.values(data)
      );
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  updateStatusCallRateToActive: async (id) => {
    try {
      const result = await pool.query(
        `UPDATE rates SET status = 'ACTIVE' WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      return error;
    }
  },
  updateStatusCallRateToInactive: async (id) => {
    try {
      const result = await pool.query(
        `UPDATE rates SET status = 'INACTIVE' WHERE id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      return error;
    }
  },
  getCurrencyBasicList: async () => {
    try {
      const result = await pool.query(`SELECT * FROM currencies`);
      return result;
    } catch (error) {
      return error;
    }
  },
  getRatesBasicList: async () => {
    try {
      const result = await pool.query(`SELECT * FROM rates`);
      return result;
    } catch (error) {
      return error;
    }
  },
  deleteCallRate: async (id) => {
    try {
      const result = await pool.query(`DELETE FROM rates WHERE id = ? `, [id]);
      return result;
    } catch (error) {
      return error;
    }
  },
};
