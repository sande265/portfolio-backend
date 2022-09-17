import { Router } from "express";

const router: Router = Router();
const auth: any = require('./Oauth/oauth.route');

router.use('/auth', auth);

module.exports = router;