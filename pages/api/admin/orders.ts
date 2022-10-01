import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IOrder } from '../../../interfaces'
import { Order } from '../../../models'

type Data = { message: string } | IOrder[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getAllOrders(req, res)

    default:
      res.status(400).json({ message: 'Bad Request' })
  }
}

const getAllOrders = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await db.connect()

  const orders = await Order.find()
    .sort({ createdAt: 'desc' })
    .populate('user', 'name email') //del usuario, traeme el Name y Email
    .lean()

  await db.disconnect()

  return res.status(200).json(orders)
}
