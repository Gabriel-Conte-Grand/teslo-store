import mongoose, { Schema, Model, model } from 'mongoose'
import { IProduct } from '../interfaces'

const productSchema = new Schema(
  {
    description: { type: String, required: true },
    image: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: {
          values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
          message: '{Value} no es un tamaño válido',
        },
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true },
    type: {
      type: String,
      enum: {
        values: ['shirts', 'pants', 'hoodies', 'hats'],
        message: '{VALUE} no es un tipo válido',
      },
    },
    gender: {
      type: String,
      enum: {
        values: ['men', 'women', 'kid', 'unisex'],
        message: '{VALUE} no es un género válido',
      },
    },
  },
  {
    timestamps: true, // Mongoose genera el CREATED_AT y UPDATED_AT
  }
)

productSchema.index({ title: 'text', tags: 'text' })

const Product: Model<IProduct> =
  mongoose.models.Product || model('Product', productSchema)

export default Product
