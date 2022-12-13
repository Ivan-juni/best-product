import React, { useEffect, useState } from 'react'
import './slick.scss'
import './slick-theme.scss'
import Slider from 'react-slick'
import styles from './Slider.module.scss'
import { ReactComponent as SliderLeftArrow } from '../../../assets/icons/other/arrows/purple-arrow-left.svg'
import { ReactComponent as SliderRightArrow } from '../../../assets/icons/other/arrows/purple-arrow-right.svg'
import { IProduct } from '../../../models/IProduct.model'

type PropsType = {
  product: IProduct
}

const ImagesSlider: React.FC<PropsType> = ({ product }) => {
  const [images, setImages] = useState<string[]>([product.image])
  const [nav1, setNav1] = useState<Slider | null>(null)
  const [nav2, setNav2] = useState<Slider | null>(null)

  useEffect(() => {
    product.images.map((obj) => {
      setImages((prev) => [...prev, obj.src])
    })
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    focusOnSelect: true,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SliderRightArrow />,
    prevArrow: <SliderLeftArrow />,
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.first__slider}>
        <Slider asNavFor={nav2 ? nav2 : undefined} ref={(slider1) => setNav1(slider1)} arrows={false}>
          {images.map((img: string, index) => (
            <img src={img} alt={'product'} key={index} />
          ))}
        </Slider>
      </div>

      <div className={styles.second__slider}>
        <Slider
          className={images.length <= 2 ? 'second__slider one-slide' : 'second__slider'}
          asNavFor={nav1 ? nav1 : undefined}
          ref={(slider2) => setNav2(slider2)}
          {...settings}
        >
          {images.map((img: string, index) => (
            <img src={img} alt={'product'} key={index} />
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ImagesSlider
