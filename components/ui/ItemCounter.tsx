import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { FC } from 'react'

interface Props {
  currentValue: number
  maxValue: number
  updateQuantity: (quantity: number) => void
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue,
  updateQuantity,
}) => {
  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        onClick={() => {
          if (currentValue === 1) return null
          updateQuantity(currentValue - 1)
        }}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center', fontWeight: '500' }}>
        {currentValue}
      </Typography>
      <IconButton
        onClick={() => {
          if (currentValue === maxValue) return null
          updateQuantity(currentValue + 1)
        }}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
