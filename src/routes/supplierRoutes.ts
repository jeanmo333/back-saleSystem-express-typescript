import express from "express";
const router = express.Router();
import { authMiddleware } from '../middlewares/authMiddleware'
import { SupplierController } from "../controllers/SupplierController";



//protected routes
router.use(authMiddleware)
router.post('/', new SupplierController().create)
router.get('/', new SupplierController().findAll)
router.get('/:term', new SupplierController().findOne)
router.patch('/:id', new SupplierController().update)
router.delete('/:id', new SupplierController().remove)


export default router;