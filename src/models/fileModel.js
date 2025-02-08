const db = require('../config/db.js');

// Get files by folder ID
const getFilesByFolder = async (folderId) => {
  const query = 'SELECT * FROM files WHERE folder_id = ?';
  const [files] = await db.execute(query, [folderId]);
  return files;
};

// Search files by query
const searchFiles = async (query) => {
  const searchQuery = 'SELECT * FROM files WHERE name LIKE ?';
  const [files] = await db.execute(searchQuery, [`%${query}%`]);
  return files;
};

module.exports = {
  getFilesByFolder,
  searchFiles
};