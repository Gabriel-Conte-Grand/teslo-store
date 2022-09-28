import { Chip, Grid, Typography, Link as MaterialLink } from '@mui/material'
import { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Link from 'next/link'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Nos informa si la orden fue pagada correctamente',
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color='success' label='Pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='No pagada' variant='outlined' />
      )
    },
  },
  {
    field: 'orderid',
    headerName: 'Revisar órdenes',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <Link href={`/orders/${params.row.orderId}`} passHref>
          <MaterialLink underline='always'>Ver orden</MaterialLink>
        </Link>
      )
    },
  },
]

interface Props {
  orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => {
    return {
      id: index + 1,
      orderId: order._id,
      paid: order.isPaid,
      fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    }
  })

  return (
    <ShopLayout
      title={'Historial de órdenes'}
      pageDescription={'Historial de órdenes del cliente'}
    >
      <Typography variant='h1' component='h1'>
        Historial de órdenes
      </Typography>

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'
import { IOrder } from '../../interfaces'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?page=/orders/history',
        permanent: false,
      },
    }
  }

  const orders = await dbOrders.getOrderByUser(session.user._id)

  return {
    props: {
      orders,
    },
  }
}

export default HistoryPage
