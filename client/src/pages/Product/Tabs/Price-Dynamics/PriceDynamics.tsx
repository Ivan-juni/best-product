import React, { useEffect, useState } from 'react'
import styles from './PriceDynamics.module.scss'
import { IPriceDynamics } from '../../../../models/IStats.model'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import moment from 'moment'

type PropsType = {
  priceDynamics: IPriceDynamics[]
}

const PriceDynamics: React.FC<PropsType> = ({ priceDynamics }) => {
  const [data, setData] = useState<IPriceDynamics[]>([])

  const formatDate = (date: string) => {
    const newDate = new Date(date)
    return moment(newDate).format('MMM, D')
  }

  useEffect(() => {
    priceDynamics.map((obj) => {
      const { datetime, ...rest } = obj

      const newObject = {
        datetime: formatDate(datetime),
        ...rest,
      }
      setData((prev) => [...prev.filter((el) => el.price !== rest.price), newObject])
    })
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.graph}>
        <LineChart width={1150} height={520} data={data}>
          <Line type='monotone' dataKey='price' strokeWidth='4' stroke='#766ED3' dot={{ stroke: '#766ED3', strokeWidth: 2, fill: '#766ED3' }} />
          <CartesianGrid stroke='#ccc' />
          <XAxis dataKey='datetime' />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  )
}

export default PriceDynamics
