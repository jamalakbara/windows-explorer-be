const db = require('../config/db.js');

// Get all folders
const getAllFolders = async () => {
  const query = 'SELECT * FROM folders';
  const [folders] = await db.execute(query);
  return folders;
};

// Get subfolders by parent ID
const getSubFolders = async (parentId) => {
  const query = 'SELECT * FROM folders WHERE parent_id = ?';
  const [subfolders] = await db.execute(query, [parentId]);
  return subfolders;
};

// Search folders by query
const searchFolders = async (query) => {
  const searchQuery = 'SELECT * FROM folders WHERE name LIKE ?';
  const [folders] = await db.execute(searchQuery, [`%${query}%`]);
  return folders;
};

module.exports = {
  getAllFolders,
  getSubFolders,
  searchFolders
};