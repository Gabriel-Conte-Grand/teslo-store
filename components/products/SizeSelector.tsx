import { Box, Button } from '@mui/material'
import { FC } from 'react'
import { ISize } from '../../interfaces'

interface Props {
  selectedSizes?: ISize
  sizes: ISize[]
  onSizeChange: (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({
  selectedSizes,
  sizes,
  onSizeChange,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size='small'
          color={selectedSizes === size ? 'primary' : 'info'}
          onClick={() => onSizeChange(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  )
}
