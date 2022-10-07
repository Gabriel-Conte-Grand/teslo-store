import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '')

type Data = { message: string } | IProduct[] | IProduct

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res)
    case 'PUT':
      return updateProduct(req, res)
    case 'POST':
      return createProduct(req, res)
    default:
      return res.status(400).json({ message: 'Bad Request' })
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()

  const products = await Product.find().sort({ title: 'ascending' }).lean()

  await db.disconnect()

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes('cloudinary')
        ? image
        : `${process.env.HOST_NAME}products/${image}`
    })
    return product
  })

  return res.status(200).json(updatedProducts)
}
const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = '', images = [] } = req.body as IProduct

  if (!isValidObjectId(_id)) {
    return res
      .status(400)
      .json({ message: 'No se reconoce el id del producto' })
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'Se necesitan al menos 2 imágenes por producto' })
  }

  try {
    await db.connect()
    const product = await Product.findById(_id)
    if (!product) {
      await db.disconnect()
      return res.status(400).json({ message: 'ID no corresponde al producto' })
    }

    product.images.forEach(async (img) => {
      if (!images.includes(img)) {
        const [fileId, extension] = img
          .substring(img.lastIndexOf('/'), +1)
          .split('.')

        await cloudinary.uploader.destroy(fileId)
      }
    })

    // Product.update -> codigo para update en DB
    await product.update(req.body)

    await db.disconnect()

    return res.status(200).json(product)
  } catch (error) {
    console.log(error)

    await db.disconnect()

    return res.status(400).json({ message: 'Hubo un error, revisar servidor' })
  }
}

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: 'El producto necesita al menos 2 imágenes' })
  }

  try {
    await db.connect() // NEW PRODUCT()
    const productInDB = await Product.findOne({ slug: req.body.slug }).lean()

    if (productInDB) {
      await db.disconnect()
      return res.status(400).json({
        message: 'Ya existe un producto con este slug y este debe ser único',
      })
    }

    const newProduct = new Product(req.body)
    await newProduct.save()

    await db.disconnect()

    return res.status(201).json(newProduct)
  } catch (error) {
    await db.disconnect()
    return res.status(400).json({ message: 'Hubo un error. Revisar servidor' })
  }
}
