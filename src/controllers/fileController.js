const { getFilesByFolder, searchFiles } = require('../models/fileModel.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/db.js');

const fetchFilesByFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const files = await getFilesByFolder(folderId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchFilesController = async (req, res) => {
  try {
    const query = req.query.q;
    const files = await searchFiles(query);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const uploadFile = async (req, res) => {
  try {
    const { folderId } = req.body;
    const filePath = req.file.path;

    await db.execute('INSERT INTO files (name, folder_id) VALUES (?, ?)', [
      req.file.filename, folderId
    ]);

    res.status(201).json({ message: 'File uploaded successfully!', filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const [file] = await db.execute('SELECT name FROM files WHERE id = ?', [fileId]);

    if (!file.length) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join('uploads', file[0].name);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ message: 'Error deleting file' });
    }

    await db.execute('DELETE FROM files WHERE id = ?', [fileId]);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchFilesByFolder,
  searchFilesController,
  upload,
  uploadFile,
  deleteFile
};