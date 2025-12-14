import {googleOAuthController, githubOAuthController} from '../../controllers/auth/outh.controllers.js';
import express from 'express';


const router = express.Router();

router.get('/google/callback', googleOAuthController);
router.get('/github/callback', githubOAuthController);

export default router;  
