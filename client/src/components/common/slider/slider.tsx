import React, { useEffect, useState } from 'react'
import './slick.scss'
import './slick-theme.scss'
import Slider from 'react-slick'
import styles from './slider.module.scss'
import { ReactComponent as SliderLeftArrow } from '../../../assets/icons/other/arrows/purple-arrow-left.svg'
import { ReactComponent as SliderRightArrow } from '../../../assets/icons/other/arrows/purple-arrow-right.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/other/edit-icon.svg'
import { ReactComponent as DeleteIcon } from '../../../assets/icons/other/delete-icon.svg'
import { ReactComponent as AddIcon } from '../../../assets/icons/other/add-icon.svg'
import { IProduct } from '../../../models/IProduct.model'
import { IImages } from '../../../models/IImages.model'

type PropsType = {
  product: IProduct
  isEditMode: boolean
  changeMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  addImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  deleteImage: (imageId: number) => void
}

const ImagesSlider: React.FC<PropsType> = ({ product, isEditMode, changeMainImage, addImage, deleteImage }) => {
  const [images, setImages] = useState<{ id: number; src: string }[]>([{ id: 0, src: product.image }])
  const [nav1, setNav1] = useState<Slider | null>(null)
  const [nav2, setNav2] = useState<Slider | null>(null)

  useEffect(() => {
    setImages([{ id: 0, src: product.image }])
    product.images.map((obj) => {
      setImages((prev) => [...prev, obj])
    })
  }, [product.images.length, product.image])

  const settings = {
    dots: false,
    infinite: true,
    focusOnSelect: true,
    swipeToSlide: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SliderRightArrow />,
    prevArrow: <SliderLeftArrow />,
  }

  return (
    <div className={styles.wrapper}>
      <div className={isEditMode ? `${styles.first__slider} ${styles.editMode}` : styles.first__slider}>
        {isEditMode && (
          <>
            <input type='file' id='add-image' name='image' hidden onChange={(e) => addImage(e)} multiple />
            <label htmlFor='add-image' className={styles.change}>
              <AddIcon className={styles.addIcon} />
            </label>
          </>
        )}
        <Slider asNavFor={nav2 ? nav2 : undefined} ref={(slider1) => setNav1(slider1)} arrows={false}>
          {images.map((image: IImages) => (
            <div key={image.id}>
              {isEditMode && (
                <div className={styles.menu}>
                  {image.src === product.image && (
                    <>
                      <input type='file' id='change-image' hidden onChange={(e) => changeMainImage(e)} multiple />
                      <label htmlFor='change-image' className={styles.change}>
                        <EditIcon className={styles.editIcon} />
                      </label>
                    </>
                  )}
                  {image.src !== product.image && (
                    <>
                      <DeleteIcon className={styles.deleteIcon} onClick={() => deleteImage(image.id)} />
                    </>
                  )}
                </div>
              )}
              <img src={image.src} alt={'product'} />
            </div>
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
          {images.map((image: IImages) => (
            <img src={image.src} alt={'product'} key={image.id} />
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default React.memo(ImagesSlider)
