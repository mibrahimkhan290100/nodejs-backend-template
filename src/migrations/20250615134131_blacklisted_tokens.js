const { table } = require("../utils/databases/db");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('blacklisted_token' , (table) =>{
    table.increments('id').primary();
    table.text('token').notNullable();
    table.dateTime('expires_at').notNullable();
    table.timestamps(true , true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('blacklisted_tokens');
};
