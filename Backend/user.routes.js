import { Router } from 'express';
import { verifyJWT } from './middleware/auth_middleware.js';

import { getAllUsers, registerUser } from './user.controller.js';
import {
  loginUser,
  logoutUser,
  refreshAccessToken
} from './user.controller.js';
import itemRouter from './items.route.js';

const router = Router();

router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser);

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);

router.route('/getUsers').get(getAllUsers);
// router.route("/updateItems").post(updateQuantity);

export default router;
