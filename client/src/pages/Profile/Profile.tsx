import React, { useEffect } from 'react'
import styles from './Profile.module.scss'
import avatar from '../../assets/images/large-avatar.png'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import Preloader from '../../components/Common/Preloader/Preloader'
import { useNavigate } from 'react-router-dom'
import { editProfile } from '../../store/slices/users/ActionCreators.users'
import ProfileForm from './profile-form/ProfileForm'
import AdminPanel from './admin-panel/AdminPanel'

const Profile: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isLoading, isAuth } = useAppSelector((state) => state.authReducer)
  const { setLogModalOpen } = useActions()

  useEffect(() => {
    navigate('/profile')
    setLogModalOpen(false)

    if (!isLoading) {
      if (!isAuth) {
        navigate('/home')
        setLogModalOpen(true)
      }
    }
  }, [isAuth, isLoading])

  const changePhotoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length === 1) {
        dispatch(editProfile({ photo: e.target.files[0], email: null, phone: null, firstName: null, lastName: null, password: null }))
      }
    }
  }

  return (
    <>
      <div className={styles.account}>
        <h1 className={styles.caption}>Account Settings</h1>
        <div className={styles.section}>
          <div className={styles.photo}>
            {isLoading ? <Preloader /> : <img src={isAuth ? (user.photo ? user.photo : avatar) : avatar} alt='avatar' />}
            <input type='file' id='change-photo' hidden onChange={changePhotoHandler} />
            <label htmlFor='change-photo' className={styles.change}>
              Change photo
            </label>
          </div>
          <div className={styles.info}>
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
      {user.role === 'ADMIN' && (
        <div className={styles.admin}>
          <h1 className={styles.caption}>Admin panel</h1>
          <AdminPanel />
        </div>
      )}
    </>
  )
}

export default Profile
