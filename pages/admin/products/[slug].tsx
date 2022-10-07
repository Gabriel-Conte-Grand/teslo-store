import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { IProduct, IType } from '../../../interfaces'
import {
  ModeEditOutlineOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@mui/icons-material'
import { dbProducts } from '../../../database'
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { tesloApi } from '../../api'
import { Product } from '../../../models'
import { useRouter } from 'next/router'

const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
  _id?: string
  description: string
  images: string[]
  inStock: number
  price: number
  sizes: string[]
  slug: string
  tags: string[]
  title: string
  type: string
  gender: string
}

interface Props {
  product: IProduct
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
  })

  const filesInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const [newTagValue, setNewTagValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'title') {
        const newSlug =
          value.title
            ?.trim()
            .replaceAll(' ', '_')
            .replaceAll(`'`, '')
            .toLowerCase() || ''

        setValue('slug', newSlug)
      }
    })
    //elimino WATCH listener para limpiarlo cuando salga de la página
    return () => {
      subscription.unsubscribe()
    }
  }, [watch, setValue])

  const onChangeSize = (size: string) => {
    const currentSizes = getValues('sizes')
    //Si existe, lo elimino ->
    if (currentSizes.includes(size)) {
      return setValue(
        'sizes',
        currentSizes.filter((s) => size !== s),
        { shouldValidate: true }
      )
    }
    // MEJOR QUE EL PUSH EL SPREAD OPERATOR [...PREV]
    return setValue('sizes', [...currentSizes, size], { shouldValidate: true })
  }

  const onFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event

    if (!target.files || target.files.length === 0) {
      return
    }

    try {
      for (const file of target.files) {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await tesloApi.post('/admin/imageupload', formData)
        console.log({ data })
        setValue('images', [...getValues('images'), data.message], {
          shouldValidate: true,
        })
      }
    } catch (error) {}
  }

  const onAddTag = () => {
    const newTag = newTagValue.trim().toLowerCase()
    setNewTagValue('') // <- ESTO ERA, ASI LIMPIO EL ESTADO Y EL INPUT STRING
    //EL ESTADO DIRIJE AL INPUT, NO AL REVES!!

    // Limpiandolo, El estado solo escucha lo
    // que le interesa del input (la ultima palabra)
    const currentTags = getValues('tags')

    if (currentTags.includes(newTag)) {
      return
    }
    currentTags.push(newTag)
    setValue('tags', currentTags)
  }

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues('tags').filter((t) => t !== tag)

    setValue('tags', updatedTags, { shouldValidate: true })
  }
  console.log({ product })
  const onSubmitForm = async (form: FormData) => {
    if (form.images.length < 2) {
      return alert('El producto necesita al menos 2 imágenes')
    }
    setIsSaving(true)
    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: form._id ? 'PUT' : 'POST',
        data: form,
      })

      console.log({ data })
      if (!form._id) {
        //si estoy creando nuevo producto...
        router.push(`/admin/products/${form.slug}`)
      } else {
        setIsSaving(false)
      }
    } catch (error) {
      console.log(error)
      setIsSaving(false)
    }
  }

  const onDeleteImage = (img: string) => {
    setValue(
      'images',
      getValues('images').filter((image) => image !== img),
      { shouldValidate: true }
    )
  }

  return (
    <AdminLayout
      title={'Producto'}
      subTitle={`Editando: ${product.title}`}
      icon={<ModeEditOutlineOutlined />}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
          <Button
            color='secondary'
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type='submit'
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Título'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label='Descripción'
              variant='filled'
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label='Inventario'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'El valor mínimo es 0' },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label='Precio'
              type='number'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'El valor mínimo es 0' },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={getValues('type')} //prop getValue y setValue de React-hook-form
                onChange={
                  (e) =>
                    setValue('type', e.target.value, { shouldValidate: true }) //shouldvalidate para q haga re-render el form con la nueva data
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues('gender')}
                onChange={(e) =>
                  setValue('gender', e.target.value, { shouldValidate: true })
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color='secondary' />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox checked={getValues('sizes').includes(size)} />
                  }
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label='Slug - URL'
              variant='filled'
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (val) =>
                  val.trim().includes(' ') // -> ASI EVITO QUE EL SLUG TENGA ESPACIOS EN BLANCO
                    ? 'No puede tener espacios en blanco'
                    : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label='Etiquetas'
              variant='filled'
              fullWidth
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              sx={{ mb: 1 }}
              helperText='Presiona [spacebar] para agregar'
              onKeyUp={({ code }) =>
                code === 'Space' ? onAddTag() : undefined
              }
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component='ul'
            >
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color='primary'
                    size='small'
                    sx={{ ml: 1, mt: 1 }}
                  />
                )
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display='flex' flexDirection='column'>
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color='secondary'
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => filesInputRef.current?.click()} //SI CLICKEO BUTON -> EVENTO CLICK EN INPUT
              >
                Cargar imagen
              </Button>
              <input
                ref={filesInputRef}
                type='file'
                multiple
                accept='image/png, image/gif, image/jpeg'
                style={{ display: 'none' }}
                onChange={onFilesSelected}
              />

              <Chip
                label='Se necesitan al menos 2 imagenes'
                color='error'
                variant='outlined'
                sx={{
                  display: getValues('images').length < 2 ? 'flex' : 'none',
                }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component='img'
                        className='fadeIn'
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color='error'
                          onClick={() => onDeleteImage(img)}
                        >
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query

  let product: IProduct | null

  if (slug === 'new') {
    const productTemplate = JSON.parse(JSON.stringify(new Product()))
    delete productTemplate._id
    productTemplate.images = ['img1.jpg', 'img2.jpg']
    product = productTemplate
  } else {
    product = await dbProducts.getProductBySlug(slug.toString())
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    }
  }

  return {
    props: {
      product,
    },
  }
}

export default ProductAdminPage
