import express from 'express';
import { createTeam,deleteTeam,removeUserFromBlackList,searchTeams,updateTeam ,addUserToBlackList,getTeamById} from '../Controllers/teamControllers.js'
const router = express.Router();

// router.get('/', getUsers);
router.post('/', createTeam);
router.put('/', updateTeam);
router.delete('/:id', deleteTeam);
router.get('/:id', getTeamById);
router.get('/search/:query', searchTeams);
router.get('/blackList/add/:tid/:uid', addUserToBlackList);
router.get('/blackList/remove/:tid/:uid', removeUserFromBlackList);

export default router;