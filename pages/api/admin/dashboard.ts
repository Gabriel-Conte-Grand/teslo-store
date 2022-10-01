import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Order, Product, User } from '../../../models'

type Data = {
  numberOfOrders: number
  paidOrders: number // isPaid true
  notPaidOrders: number
  numberOfClients: number // role:client
  numberOfProducts: number
  productsOutOfStock: number
  lowInventory: number //--> 10 o menos articulos
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return getAllOrdersInfo(req, res)
}

const getAllOrdersInfo = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  // Vale, pero no es lo mejor ->
  // const numberOfOrders = await Order.count()
  // const paidOrders = await Order.find({isPaid: true}).count()
  // const notPaidOrders = numberOfOrders - paidOrders
  // const numberOfClients = await User.find({role: 'client'}).count()
  // const numberOfProducts = await Product.count()
  // const productsOutOfStock = await Product.find({inStock : 0}).count()
  // const lowInventory = await Product.find({inStock: { $lte: 10} }).count() --> $lte = menor o igual a 10

  await db.connect()

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsOutOfStock,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 5 } }).count(),
  ])

  await db.disconnect()

  return res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsOutOfStock,
    lowInventory,
  })
}
