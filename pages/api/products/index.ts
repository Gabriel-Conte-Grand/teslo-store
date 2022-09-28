import { constants } from 'buffer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = { message: string } | IProduct[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)

    default:
      return res.status(400).json({
        message: 'Bad Request',
      })
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()

  const { gender = 'all' } = req.query

  let condition = {}

  if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender }
  }

  const products = await Product.find(condition)
    .select('title images price inStock slug -_id') //saco el id del response
    .lean()

  await db.disconnect()

  return res.status(200).json(products)
}
