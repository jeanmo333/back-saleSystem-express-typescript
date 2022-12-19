import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
import { errorMiddleware } from './middlewares/error'
import userRoutes from './routes/userRoutes'
import categoryRoutes from './routes/categoryRoutes'
import customerRoutes from './routes/customerRoutes'
import supplierRoutes from './routes/supplierRoutes'
import productRoutes from './routes/productRoutes'
import saleRoutes from './routes/saleRoutes'


AppDataSource.initialize().then(() => {
	const app = express()

	app.use(express.json())

	app.use("/api/users", userRoutes);
	app.use("/api/categories", categoryRoutes);
	app.use("/api/customers", customerRoutes);
	app.use("/api/suppliers", supplierRoutes);
	app.use("/api/products", productRoutes);
	app.use("/api/sales", saleRoutes)

	app.use(errorMiddleware)

	const PORT = process.env.PORT || 3000;
	//return app.listen(process.env.PORT)
	app.listen(PORT, () => {
		console.log(`Server listening on port: ${PORT}`);
	  });
})
