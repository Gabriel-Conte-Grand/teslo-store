import { FC } from 'react'
import { Slide } from 'react-slideshow-image'
import styles from './ProductSlideShow.module.css'
import 'react-slideshow-image/dist/styles.css'

interface Props {
  images: string[]
}

export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <>
      <Slide
        easing='ease'
        duration={7000} //7segundos de duracion
        indicators
      >
        {images.map((img) => {
          let url = `/products/${img}`
          return (
            <div className={styles['each-slide']} key={img}>
              <div
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </div>
          )
        })}
      </Slide>
    </>
  )
}
