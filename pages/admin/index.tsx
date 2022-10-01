import {
  AccessTime,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts'
import { DashboardOrdersInfo } from '../../interfaces'

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardOrdersInfo>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, // 30segundos
  })

  const [refreshIn, setRefreshIn] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((prevState) => (prevState > 0 ? prevState - 1 : 30))
    }, 1000)

    return () => {
      //cleanup function
      clearInterval(interval)
      // corto el conteo cuando salgo de la página!
    }
  }, [])

  if (!error && !data) {
    return <></>
  }
  if (error) {
    console.log(error)
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsOutOfStock,
    lowInventory,
  } = data!

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Métricas del negocio'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle={'Órdenes totales'}
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 45 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subTitle={'Órdenes pagadas'}
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 45 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subTitle={'Órdenes pendientes'}
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 45 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subTitle={'Clientes'}
          icon={<GroupOutlined color='action' sx={{ fontSize: 45 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subTitle={'Productos'}
          icon={<CategoryOutlined color='secondary' sx={{ fontSize: 45 }} />}
        />
        <SummaryTile
          title={productsOutOfStock}
          subTitle={'Sin existencias'}
          icon={
            <CancelPresentationOutlined color='error' sx={{ fontSize: 45 }} />
          }
        />
        <SummaryTile
          title={lowInventory}
          subTitle={'Bajo inventario'}
          icon={
            <ProductionQuantityLimitsOutlined
              color='warning'
              sx={{ fontSize: 45 }}
            />
          }
        />
        <SummaryTile
          title={refreshIn}
          subTitle={'Actualización en:'}
          icon={<AccessTime color='disabled' sx={{ fontSize: 45 }} />}
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage
