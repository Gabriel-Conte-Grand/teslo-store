import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'

export const Loading = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='calc(100vh - 200px)'
    >
      <Typography sx={{ mb: 1 }} variant='h2' fontSize={23} fontWeight={400}>
        Teslo Store
      </Typography>
      <Typography sx={{ mb: 3 }} variant='body1' fontSize={15} fontWeight={400}>
        Cargando...
      </Typography>
      <CircularProgress thickness={1.8} />
    </Box>
  )
}
