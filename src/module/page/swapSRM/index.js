import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import {thousands, weiToPOC, hideAddress, hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'
import {ArrowDownOutlined} from '@ant-design/icons'
import bigDecimal from 'js-big-decimal'
import 'antd/dist/antd.css';
import './style.scss'

const swap = () => {
  const serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        [srmAddress, setSrmAddress] = useState(''),
        balance = useSelector(state => state.claimASRM.balance),
        [fbId, setFbId] = useState(''),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(false),
        [asrmAmount, setAsrmAmount] = useState(''),
        [srmAmount, setSrmAmount] = useState(0)

  const claimAsrmService = new ClaimAsrmService()

  const regexp = {
    ETH: /^0x[a-fA-F0-9]{40}$/,
    NUM: /^[0-9]+(\.[0-9]+)?$/
  }

  useEffect(() => {
    claimAsrmService.asrmBalance()
  }, [])

  useEffect(() => {
    if (serverResponse) {
      setDisableSubmit(false)
      setAsrmAmount('')
      setSrmAddress('')
      setSrmAmount(0)
    }
  }, [serverResponse])

  useEffect(() => {
    if (signatureResponse) {
      setDisableSubmit(false)
    }
  }, [signatureResponse])

  const exchange = async() => {
    // setDisableSubmit(true)
    setErr('')
    if (srmAddress == '' && srmAmount == '' && asrmAmount == 0) {
      setErr('fill all input')
      setDisableSubmit(true)
    } else {
      claimAsrmService.swapSRM(asrmAmount, srmAddress);
    }
  }

  const onChangeSRM = (e) => {
    setErr('')
    setDisableSubmit(false)
    console.log(e.target.value)
    setAsrmAmount(e.target.value)
    if(regexp.NUM.test(e.target.value)) {
      setSrmAmount(thousands(bigDecimal.multiply(e.target.value, 0.001),5))
    }
    if(e.target.value == '') {
      setAsrmAmount('')
      setSrmAmount('')
    }
    if (parseFloat(e.target.value) > parseFloat(balance) && regexp.NUM.test(e.target.value)) {
      setErr('not enough ASRM')
      setDisableSubmit(true)
    }
  }

  const changeSrmAddress = (e) => {
    setSrmAddress(e.target.value)
  }

  return (
    <StandardPage>
      <Row className="margin-top-md">
        <p>ASRM balance: {thousands(balance,5)}</p>
      </Row>
      <Row>
        <Col span={24} className="margin-top-md">
          <div className="right-align">
            <button className="swap-btn swap-btn-green btn-all-in"
            onClick={() => {
              setAsrmAmount(balance)
              setSrmAmount(thousands(bigDecimal.multiply(balance, 0.001),5))
            }
            }>
              max</button>
            <Input
              type="text" className="swap-input" value={asrmAmount}
              onChange={onChangeSRM}>
            </Input>
          </div>
        </Col>
        <Col span={24}>
          <div className="margin-top-md center exchange_arrow">
            <span>
              <ArrowDownOutlined />
            </span>
          </div>
        </Col>
      </Row>
      <Row className="margin-top-md">
        <Input type="text" className="swap-input" value={srmAmount}/>
      </Row>
      <Row className="margin-top-md">
        <p>SRM address:</p>
      </Row>
      <Row>
        <Input type="text" className="swap-input" onChange={changeSrmAddress} value={srmAddress}/>
      </Row>
      <p className="center text-red">{err}</p>
      <div className="center margin-top-button margin-bot-md">
        <button className="btn-submit" onClick={exchange} disabled={disableSubmit}>
          {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
          Exchange
        </button>
      </div>
    </StandardPage>
  )
}

export default swap;
