import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IPaypal } from '../../../interfaces'
import { Order } from '../../../models'

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return payOrder(req, res)

    default:
      res.status(200).json({ message: 'Bad request' })
  }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64')

  const body = new URLSearchParams('grant_type=client_credentials')

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || '',
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return data.access_token
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data!)
    } else {
      console.log(error)
    }

    return null
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const paypalBearerToken = await getPayPalBearerToken()

  if (!paypalBearerToken) {
    return res
      .status(400)
      .json({ message: 'No se pudo confirmar el token de Paypal' })
  }

  const { transactionId = '', orderId = '' } = req.body

  const { data } = await axios.get<IPaypal.PaypalOrderStatus>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  )

  if (data.status !== 'COMPLETED') {
    return res.status(401).json({ message: 'Orden no reconocida' })
  }

  await db.connect()

  const dbOrder = await Order.findById(orderId)

  await db.disconnect()

  if (!dbOrder) {
    return res
      .status(400)
      .json({ message: 'Orden no identificada por nuestra base de datos' })
  }

  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    return res
      .status(400)
      .json({ message: 'Los montos de Paypal y nuestra orden no coinciden' })
  }

  //Ya pasó todas las validaciones --> update a la DB
  dbOrder.transactionId = transactionId
  dbOrder.isPaid = true
  dbOrder.save()
  return res.status(200).json({ message: 'Orden pagada' })
}
