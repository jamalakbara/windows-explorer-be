const express = require('express');
const { fetchAllFolders, fetchSubFolders, searchFoldersController, createFolder, renameFolder, deleteFolder,getFolders } = require('../controllers/folderController.js');

const router = express.Router();

// router.get('/folders', fetchAllFolders);
router.get('/folders/:parentId', fetchSubFolders);
router.get('/search/folders', searchFoldersController);
// router.post('/folders', createFolder);
router.put('/folders/:folderId', renameFolder);
router.delete('/folders/:folderId', deleteFolder);

router.get('/folders', getFolders);
router.post('/folders', createFolder);

module.exports = router;