import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
  SummarizeOutlined,
} from '@mui/icons-material'
import { Box, Card, Divider, Grid, Typography, Chip } from '@mui/material'

import { NextPage } from 'next'
import { CartList, OrderSummary } from '../../../components/cart'
import { AdminLayout, ShopLayout } from '../../../components/layouts'
import { GetServerSideProps } from 'next'

import { dbOrders } from '../../../database'
import { IOrder } from '../../../interfaces'

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, orderItems, numberOfItems, shippingAddress } = order

  const { address, city, country, firstName, lastName, phone, zip } =
    shippingAddress

  return (
    <AdminLayout
      title={'Resumen de la orden'}
      subTitle={`Orden ID: ${_id}`}
      icon={<SummarizeOutlined />}
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
                  label='Pendiente de pago'
                  variant='outlined'
                  color='error'
                  icon={<CreditCardOffOutlined />}
                />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query

  const order = await dbOrders.getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
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
