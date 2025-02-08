const { getAllFolders, getSubFolders, searchFolders } = require('../models/folderModel.js');
const db = require('../config/db.js');

const fetchAllFolders = async (req, res) => {
  try {
    const folders = await getAllFolders();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchSubFolders = async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const subfolders = await getSubFolders(parentId);
    res.json(subfolders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchFoldersController = async (req, res) => {
  try {
    const query = req.query.q;
    const folders = await searchFolders(query);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const [result] = await db.execute(
      'INSERT INTO folders (name, parent_id) VALUES (?, ?)',
      [name, parentId || null]
    );

    res.status(201).json({ id: result.insertId, name, parentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: "New folder name is required" });
    }

    await db.execute('UPDATE folders SET name = ? WHERE id = ?', [newName, folderId]);

    res.status(200).json({ message: 'Folder renamed successfully', newName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const [folder] = await db.execute('SELECT * FROM folders WHERE id = ?', [folderId]);
    if (!folder.length) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await db.execute('DELETE FROM folders WHERE id = ?', [folderId]);

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFolders = async (req, res) => {
  try {
    const getSubfolders = async (parentId) => {
      const [folders] = await db.execute('SELECT * FROM folders WHERE parent_id = ?', [parentId]);
      const subfolderPromises = folders.map(async (folder) => {
        folder.children = await getSubfolders(folder.id);
        return folder;
      });
      return Promise.all(subfolderPromises);
    };

    const [rootFolders] = await db.execute('SELECT * FROM folders WHERE parent_id IS NULL');
    const rootFolderPromises = rootFolders.map(async (folder) => {
      folder.children = await getSubfolders(folder.id);
      return folder;
    });

    const result = await Promise.all(rootFolderPromises);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchAllFolders,
  fetchSubFolders,
  searchFoldersController,
  createFolder,
  renameFolder,
  deleteFolder,
  getFolders
};