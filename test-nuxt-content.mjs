import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('.nuxt/content/content.sqlite');
db.all("SELECT * FROM _content LIMIT 10", (err, rows) => {
  if (err) throw err;
  console.log(rows);
});
