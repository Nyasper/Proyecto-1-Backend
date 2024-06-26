import { Router } from 'express';
import taskController from './controllers/taskController';
import userController from './controllers/userController';
import adminController from './controllers/adminController';
import Middlewares from './middlewares';

const router = Router();

router.use('/api/v1/user', userController);
router.use('/api/v1/admin', Middlewares.authAdmin, adminController);
router.use('/api/v1/tasks', Middlewares.auth, taskController);

export default router;
