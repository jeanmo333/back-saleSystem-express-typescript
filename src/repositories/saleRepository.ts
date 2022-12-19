import { AppDataSource } from '../data-source'
import { Sale } from '../entities/Sale'



export const saleRepository = AppDataSource.getRepository(Sale)