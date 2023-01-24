import express from "express";
import isAuth from "../controllers/is-auth";

const router = express.Router();

router.get('/auth', isAuth);

export default router;