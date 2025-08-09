/**
 * Database utility functions
 * 
 * This module provides helper functions for common database operations
 */

const db = require('./db');

/**
 * Get a single record by ID
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<Object>} - Record object or null
 */
async function getById(table, id) {
  try {
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Error getting ${table} by ID:`, error);
    throw error;
  }
}

/**
 * Get all records from a table with optional filtering
 * @param {string} table - Table name
 * @param {Object} filters - Filter conditions
 * @param {number} limit - Maximum number of records to return
 * @param {number} offset - Number of records to skip
 * @returns {Promise<Array>} - Array of records
 */
async function getAll(table, filters = {}, limit = 100, offset = 0) {
  try {
    // Build WHERE clause from filters
    const conditions = [];
    const values = [];
    let paramIndex = 1;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Add pagination
    values.push(limit);
    values.push(offset);
    
    const query = `
      SELECT * FROM ${table}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(`Error getting all ${table}:`, error);
    throw error;
  }
}

/**
 * Insert a new record
 * @param {string} table - Table name
 * @param {Object} data - Record data
 * @returns {Promise<Object>} - Inserted record
 */
async function create(table, data) {
  try {
    console.log(`Creating ${table} with data:`, data);
    
    // Build column names and placeholders
    const columns = Object.keys(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    const values = Object.values(data);
    
    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    console.log('Executing query:', query);
    console.log('With values:', values);
    
    const result = await db.query(query, values);
    console.log('Query result:', result.rows[0]);
    
    return result.rows[0];
  } catch (error) {
    console.error(`Error creating ${table}:`, error);
    throw error;
  }
}

/**
 * Update a record
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @param {Object} data - Record data
 * @returns {Promise<Object>} - Updated record
 */
async function update(table, id, data) {
  try {
    // Build SET clause
    const columns = Object.keys(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
    const values = Object.values(data);
    
    // Add ID to values
    values.push(id);
    
    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
}

/**
 * Delete a record
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<boolean>} - True if deleted
 */
async function remove(table, id) {
  try {
    const query = `DELETE FROM ${table} WHERE id = $1 RETURNING id`;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error deleting ${table}:`, error);
    throw error;
  }
}

/**
 * Count records in a table with optional filtering
 * @param {string} table - Table name
 * @param {Object} filters - Filter conditions
 * @returns {Promise<number>} - Count of records
 */
async function count(table, filters = {}) {
  try {
    // Build WHERE clause from filters
    const conditions = [];
    const values = [];
    let paramIndex = 1;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const query = `SELECT COUNT(*) FROM ${table} ${whereClause}`;
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error(`Error counting ${table}:`, error);
    throw error;
  }
}

/**
 * Check if a record exists
 * @param {string} table - Table name
 * @param {Object} filters - Filter conditions
 * @returns {Promise<boolean>} - True if exists
 */
async function exists(table, filters = {}) {
  try {
    const totalMatchingRecords = await count(table, filters);
    return totalMatchingRecords > 0;
  } catch (error) {
    console.error(`Error checking if ${table} exists:`, error);
    throw error;
  }
}

module.exports = {
  getById,
  getAll,
  create,
  update,
  remove,
  count,
  exists
};