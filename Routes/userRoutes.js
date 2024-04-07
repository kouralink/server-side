import express from 'express';
import { getUsers, getUser, isUsernameUnique, createUser, updateUser, deleteUser } from '../Controllers/userControllers.js'


const router = express.Router();

router.get('/', getUsers);
router.get('/:username', getUser);
router.get('/isUsernameUnique/:username', isUsernameUnique);
router.post('/', createUser);
router.put('/:username', updateUser);
router.delete('/:username', deleteUser);


export default router;