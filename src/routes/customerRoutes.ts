import express from "express";
const router = express.Router();
import { authMiddleware } from '../middlewares/authMiddleware'
import { CustomerController } from "../controllers/CustomerController";


//protected routes
router.use(authMiddleware)
router.post('/', new CustomerController().create)
router.get('/', new CustomerController().findAll)
router.get('/:term', new CustomerController().findOne)
router.patch('/:id', new CustomerController().update)
router.delete('/:id', new CustomerController().remove)


export default router;