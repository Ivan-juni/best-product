import React from 'react'
import styles from './footer.module.scss'
import { NavLink } from 'react-router-dom'
import { ReactComponent as LogoIcon } from 'assets/icons/footer-logo-icon.svg'
import { ReactComponent as CopyrightIcon } from 'assets/icons/other/copyright-icon.svg'
import { ReactComponent as FacebookIcon } from 'assets/icons/social-media/facebook-icon.svg'
import { ReactComponent as InstagramIcon } from 'assets/icons/social-media/instagram-icon.svg'
import { ReactComponent as YoutubeIcon } from 'assets/icons/social-media/youtube-icon.svg'

const Footer: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <ul className={styles.items}>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                Our services
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                Product reviews
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                Reviews of stores
              </NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <ul className={styles.items}>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                To users
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                FAQ for users
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                About the project
              </NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <ul className={styles.items}>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                FeedBack
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                For users
              </NavLink>
            </li>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                For online stores
              </NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <ul className={styles.items}>
            <li className={styles.item}>
              <NavLink to={'/home/#'} className={styles.text}>
                Social media
              </NavLink>
            </li>
            <li className={styles.item + ' ' + styles.social}>
              <NavLink to={'/home/#'} className={styles.icon}>
                <FacebookIcon className={styles.facebook} />
              </NavLink>
              <NavLink to={'/home/#'} className={styles.icon}>
                <InstagramIcon className={styles.instagram} />
              </NavLink>
              <NavLink to={'/home/#'} className={styles.icon}>
                <YoutubeIcon className={styles.youtube} />
              </NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.column + ' ' + styles.logo}>
          <NavLink className={styles.link} to='/home'>
            <LogoIcon className={styles.logo__thumb} />
            <div className={styles.info}>
              <h1>BEST PRODUCTS</h1>
              <h2>Stay home. Shop Online</h2>
              <div className={styles.copyright}>
                <CopyrightIcon className={styles.icon} />
                <h3 className={styles.text}>Best Products 2022</h3>
              </div>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Footer
