import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthState } from 'store/slices/auth/auth.selectors'
import { useActions, useAppSelector } from '../hooks/redux'

export function withAuthRedirect<WCP extends JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<WCP>) {
  function RedirectComponent(props: WCP) {
    // * Redirect *
    const navigate = useNavigate()
    const { isLoading, isAuth } = useAppSelector(getAuthState)
    const { setLogModalOpen } = useActions()
    const [redirect, setRedirect] = useState<boolean>(false)

    useEffect(() => {
      setLogModalOpen(false)
      setRedirect(true)
    }, [isAuth])

    if (redirect === true) {
      if (!isLoading) {
        if (!isAuth) {
          setLogModalOpen(true)
          navigate('/home')
        }
      }
      return <WrappedComponent {...props} />
    }

    return null
  }
  return RedirectComponent
}
