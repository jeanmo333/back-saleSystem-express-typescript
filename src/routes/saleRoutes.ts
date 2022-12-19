import express from "express";
import { SaleController } from "../controllers/SaleController";
const router = express.Router();
import { authMiddleware } from '../middlewares/authMiddleware'



//protected routes
router.use(authMiddleware)
router.post('/', new SaleController ().create)
router.get('/', new SaleController ().findAll)
router.get('/:id', new SaleController ().findOne)
// router.patch('/:id', new ProductController ().update)
// router.delete('/:id', new ProductController ().remove)


export default router;