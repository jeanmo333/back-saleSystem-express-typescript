import { AppDataSource } from '../data-source'
import { Supplier } from '../entities/Supplier'


export const supplierRepository = AppDataSource.getRepository(Supplier)