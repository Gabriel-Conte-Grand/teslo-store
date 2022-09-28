import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material'
import {
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material'

import { NextPage } from 'next'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'
import { IOrder } from '../../interfaces'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { tesloApi } from '../api'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface Props {
  order: IOrder
}

export type OrderResponseBody = {
  id: string
  status:
    | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED'
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, orderItems, numberOfItems, shippingAddress } = order

  const [isPaying, setIsPaying] = useState<boolean>(false)
  const router = useRouter()

  const { address, city, country, firstName, lastName, phone, zip } =
    shippingAddress

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No se pudo realizar el pago')
    }
    setIsPaying(true)

    try {
      const { data } = await tesloApi.post(`/orders/paypal`, {
        transactionId: details.id,
        orderId: _id,
      })

      router.reload()
    } catch (error) {
      console.log(error)
      setIsPaying(false)
    }
  }

  return (
    <ShopLayout
      title={'Resumen de la orden'}
      pageDescription={'Resumen de la orden de compra'}
    >
      <Typography variant='h1' component='h1'>
        Orden: {_id}
      </Typography>

      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='Compra exitosa'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Pago pendiente'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container sx={{ mt: 1 }} className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card' sx={{ padding: 1 }}>
            <Typography variant='h2'>
              Resumen ({numberOfItems}{' '}
              {numberOfItems > 1 ? 'productos' : 'producto'})
            </Typography>
            <Divider sx={{ my: 1 }} />

            <Box display='flex' justifyContent='space-between'>
              <Typography variant='subtitle1'>Dirección de entrega</Typography>
            </Box>

            <Typography variant='subtitle1'></Typography>
            <Typography>
              {firstName} {lastName}
            </Typography>
            <Typography>{address}</Typography>
            <Typography>
              {city}, {zip}
            </Typography>
            <Typography>{country}</Typography>
            <Typography>{phone}</Typography>

            <Divider sx={{ my: 1 }} />

            <OrderSummary order={order} />
            <Box sx={{ m: 3 }} display='flex' flexDirection='column'>
              <Box
                sx={{ display: isPaying ? 'flex' : 'none' }}
                display='flex'
                justifyContent='center'
                className='fadeIn'
              >
                <CircularProgress />
              </Box>
              <Box
                sx={{
                  display: isPaying ? 'none' : 'flex',
                  flex: 1,
                  flexDirection: 'column',
                }}
              >
                {isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label='Compra exitosa'
                    variant='outlined'
                    color='success'
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: `${order.total}`,
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then((details) => {
                        // console.log({ details })
                        onOrderCompleted(details)
                        const name = details.payer.name!.given_name
                      })
                    }}
                  />
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/${id}`,
        permanent: false,
      },
    }
  }

  const order = await dbOrders.getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      },
    }
  }

  return {
    props: {
      order,
    },
  }
}

export default OrderPage
