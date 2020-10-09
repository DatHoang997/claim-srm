import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button } from 'antd'
import ClaimZsrmService from '@/service/ClaimZSRMService'
import { LoadingOutlined } from '@ant-design/icons'
import {thousands, weiToPOC, hideAddress, hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'
import {ArrowDownOutlined} from '@ant-design/icons'
import bigDecimal from 'js-big-decimal'
import 'antd/dist/antd.css';
import './style.scss'

const stats = () => {
  const dispatch = useDispatch(),
        serverResponse = useSelector(state => state.claimZSRM.serverResponse),
        signatureResponse = useSelector(state => state.claimZSRM.signatureResponse),
        [srmAddress, setSrmAddress] = useState(''),
        [fbId, setFbId] = useState(''),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(false),
        [zsrmAmount, setZsrmAmount] = useState(''),
        [srmAmount, setSrmAmount] = useState(0),
        [zsrmBalance, serZsrmBalance] = useState(10)

  const claimZsrmService = new ClaimZsrmService()

  const regexp = {
    ETH: /^0x[a-fA-F0-9]{40}$/,
    NUM: /^[0-9]+(\.[0-9]+)?$/
  }

  useEffect(() => {
    if (serverResponse) {
      setDisableSubmit(false)
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
    claimZsrmService.swapSRM(zsrmAmount, srmAddress);
  }

  const onChangeSRM = (e) => {
    setErr('')
    setDisableSubmit(false)
    console.log(e.target.value)
    setZsrmAmount(e.target.value)
    if(regexp.NUM.test(e.target.value)) {
      setSrmAmount(thousands(bigDecimal.multiply(e.target.value, 1000),5))
    }
    if(e.target.value == '') {
      setZsrmAmount('')
      setSrmAmount('')
    }
  }

  const changeSrmAddress = (e) => {
    setSrmAddress(e.target.value)
  }

  console.log(srmAddress)

  return (
    <StandardPage>
      <Row>
        <Col span={24} className="margin-top-md">
          <div className="right-align">
            <button className="swap-btn swap-btn-green btn-all-in"
            onClick={() => {
              setZsrmAmount(zsrmBalance)
              setSrmAmount(thousands(bigDecimal.multiply(zsrmBalance, 1000),5))
            }
            }>
              max</button>
            <Input
              type="text" className="fanPage-input" value={zsrmAmount}
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
        <Input type="text" className="ant-picker-input" value={srmAmount}/>
      </Row>
      <Row className="margin-top-md">
        <p>SRM address:</p>
      </Row>
      <Row>
        <Input type="text" className="ant-picker-input" onChange={changeSrmAddress} value={srmAddress}/>
      </Row>
      <p className="center text-red">{err}</p>
      <div className="center margin-top-md margin-bot-md">
        <button className="btn-submit" onClick={exchange} disabled={disableSubmit}>
          {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
          Exchange
        </button>
      </div>
    </StandardPage>
  )
}

export default stats;
