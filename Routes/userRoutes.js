import express from 'express';
import { getUserByUsername,getUserByUID, isUsernameUnique, createUser, updateUser, deleteUser } from '../Controllers/userControllers.js'


const router = express.Router();

// router.get('/', getUsers);
router.get('/get/by/username/:username', getUserByUsername);
router.get('/get/by/uid/:uid', getUserByUID);
router.get('/isUsernameUnique/:username', isUsernameUnique);
router.post('/', createUser);
router.put('/:uid', updateUser);
router.delete('/:uid', deleteUser);


export default router;