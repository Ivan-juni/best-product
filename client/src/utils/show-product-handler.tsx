import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { NavigateFunction } from 'react-router-dom'

export const showProductHandler = (
  id: number,
  navigate: NavigateFunction,
  setProductId: ActionCreatorWithPayload<number, 'product/setProductId'>
) => {
  setProductId(id)
  navigate(`/product?productId=${id}`)
}
