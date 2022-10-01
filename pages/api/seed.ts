import { db, seedDatabase } from '../../database'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Order, Product, User } from '../../models'

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'No tine acceso a este servicio' })
  }

  await db.connect()
  //CARGO USUARIOS A LA DB
  await User.deleteMany()
  await User.insertMany(seedDatabase.initialData.users)

  //CARGO PRODUCTOS A LA DB
  await Product.deleteMany()
  await Product.insertMany(seedDatabase.initialData.products)

  await Order.deleteMany()

  await db.disconnect()

  res.status(200).json({ message: 'Proceso realizado correctamente' })
}
