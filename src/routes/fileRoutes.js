const express = require('express');
const { fetchFilesByFolder, searchFilesController, upload, uploadFile, deleteFile } = require('../controllers/fileController.js');

const router = express.Router();

router.get('/files/:folderId', fetchFilesByFolder);
router.get('/search/files', searchFilesController);

router.post('/upload', upload.single('file'), uploadFile);
router.delete('/delete/:fileId', deleteFile);

module.exports = router;