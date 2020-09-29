import React, {useEffect, useState} from 'react'
import "antd/dist/antd.css";
import './style.scss'

const stats = () => {
  useAuth()
  const isAdmin                                       = useSelector(state => state.citizen.isAdmin),
        dispatch                                      = useDispatch()

  useEffect(() => {
    adminConfigService.pocBalance()
    adminConfigService.dead()
  }, [])

  useEffect(() => {
    if (dead && pocBalance) {
      adminConfigService.pocStats(pocBalance,dead)
    }
  }, [dead, pocBalance])

  useEffect(() => {
    setSoldError(pocStats.error)
  }, [pocStats.error])

  const convertTime = (time) => {
    let date = new Date(time)
    return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ' '+ pad(date.getDate()) +'-'+ pad(date.getMonth() + 1) + '-' + date.getFullYear();
  }

  const pad = (num) =>  {
    return ('0' + num).slice(-2)
  }

  const getPocStats = async () => {
    setError('')
    let error = await adminConfigService.pocStats(pocBalance, dead, dbConvertedAmount, dbPrice, dbTxHash)
    if (error) {
      setDisableSubmit(false)
      setError(error.data.error)
    } else {
      setDisableSubmit(false)
      setDbAmount('')
      setDbConvertedAmount('')
      setDbDead('')
      setDbPocBalance('')
      setDbPrice('')
      setDbTxHash('')
    }
  }

  const convertAmount = (e) => {
    setDbAmount(e.target.value)
    let num = (BigNumber(e.target.value).mult('1000000000000000000')).toString()
    setDbConvertedAmount(num)
  }

  const config = async() => {
    if (volume != '' && time != '') {
      if (regexp.NUM.test(volume)) {
        const response = await exchangeService.configExchange(usdtToWei(volume), time)
        console.log(response)
        if (response.statusText == 'OK') {
          setVolume('')
          setTime('')
        }
      } else {
        setConfigError(I18N.get('volume_must_be_number'))
      }
    } else
    setConfigError(I18N.get('fill_all_input'))
  }

  return (
    <StandardPage>

    </StandardPage>
  )
}

export default stats;
