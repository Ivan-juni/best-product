import { createAsyncThunk } from '@reduxjs/toolkit'
import { ProductChangingValues } from '../../../http/product-service/product.model'
import ProductService from '../../../http/product-service/product.service'
import { FormikType } from '../../../models/Formik.model'
import { IProductQuery } from '../../../models/IProduct.model'
import { productAction } from './Product.slice'

type FetchProductsType = FormikType & IProductQuery

export const fetchProducts = createAsyncThunk<void, FetchProductsType, { rejectValue: string }>(
  'product/fetchProducts',
  async (searchCriteria, thunkApi) => {
    try {
      // убираем поля setSubmitting, setStatus из searchCriteria
      const { setSubmitting, setStatus, ...rest } = searchCriteria

      const response = await ProductService.getProducts(rest)

      thunkApi.dispatch(productAction.setProducts(response.data))

      if (searchCriteria.setSubmitting) {
        searchCriteria.setSubmitting(false)
      }
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (searchCriteria.setSubmitting && searchCriteria.setStatus) {
        searchCriteria.setStatus(error.response?.data?.message)
        searchCriteria.setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

type EditProductType = { id: number } & ProductChangingValues & { setStatus?: (arg0: string) => void; setSubmitting?: (arg0: boolean) => void }

export const editProduct = createAsyncThunk<void, EditProductType, { rejectValue: string }>(
  'product/editProduct',
  async ({ id, setStatus, setSubmitting, ...changingValues }, thunkApi) => {
    try {
      const response = await ProductService.editProduct(id, changingValues)

      thunkApi.dispatch(productAction.setProducts({ total: 1, results: [response.data] }))

      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (setSubmitting && setStatus) {
        setStatus(error.response?.data?.message)
        setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteProduct = createAsyncThunk<void, { id: number }, { rejectValue: string }>('product/deleteProduct', async ({ id }, thunkApi) => {
  try {
    await ProductService.deleteProduct(id)

    await thunkApi.dispatch(fetchProducts({}))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const addImage = createAsyncThunk<void, { id: number; image: File }, { rejectValue: string }>(
  'product/images/addImage',
  async ({ id, image }, thunkApi) => {
    try {
      await ProductService.addImage(id, image)

      await thunkApi.dispatch(fetchProducts({ id: `${id}` }))
    } catch (error: any) {
      console.log(error.response?.data?.message)

      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteImage = createAsyncThunk<void, { productId: number; imageId: number }, { rejectValue: string }>(
  'product/images/deleteImage',
  async ({ productId, imageId }, thunkApi) => {
    try {
      await ProductService.deleteImage(productId, imageId)

      await thunkApi.dispatch(fetchProducts({ id: `${productId}` }))
    } catch (error: any) {
      console.log(error.response?.data?.message)

      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)
