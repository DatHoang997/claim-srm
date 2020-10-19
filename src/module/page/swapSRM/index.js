import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button, message } from 'antd'
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
        balance = useSelector(state => state.claimASRM.balance),
        wallet = useSelector(state => state.claimASRM.wallet),
        [srmAddress, setSrmAddress] = useState(''),
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
    if (serverResponse.message == 'swap success') {
      message.success('Chuyển thành công SRM')
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
    console.log('srm', srmAddress)
    if (srmAddress == '' || srmAmount == '' || asrmAmount == 0) {
      setErr('vui lòng điền đầy đủ thông tin')
      setDisableSubmit(true)
    } else {
      claimAsrmService.swapSRM(asrmAmount, srmAddress, wallet);
      setDisableSubmit(true)
    }
  }

  const onChangeSRM = (e) => {
    setErr('')
    setDisableSubmit(false)
    console.log(e.target.value)
    setAsrmAmount(e.target.value)
    if(regexp.NUM.test(e.target.value)) {
      setSrmAmount(thousands(bigDecimal.multiply(e.target.value, 0.001), 7))
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
    setDisableSubmit(false)
    setSrmAddress(e.target.value)
  }

  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          <div className="margin-top-sm center">
            <span>
              <p className="text-white-light">Số dư aSRM: {thousands(balance, 7)}</p>
            </span>
          </div>
        </Col>
        <Col span={24} className="margin-top-sm">
          <div className="right-align">
            <button className="swap-btn btn-all-in"
            onClick={() => {
              setAsrmAmount(balance)
              setSrmAmount(thousands(bigDecimal.multiply(balance, 0.001), 7))
            }
            }>
              Max</button>
            <Input
              type="text" className="swap-input" value={asrmAmount}
              onChange={onChangeSRM} placeholder="Số aSRM sẽ chuyển">
            </Input>
          </div>
        </Col>
        <Col span={24}>
          <div className="margin-top-sm center">
            <span className="swap-icon">
              <ArrowDownOutlined />
            </span>
          </div>
        </Col>
      </Row>
      <Row className="center">
      <Col span={24}>
          <div className="margin-top-sm center">
            <span>
              <p className="text-white-light">Số SRM nhận được: {thousands(srmAmount, 7)}</p>
            </span>
          </div>
        </Col>
      </Row>
      <Row>
        <Input type="text" className="swap-input margin-top-sm" onChange={changeSrmAddress} value={srmAddress} placeholder="Địa chỉ SRM"/>
      </Row>
      { err ?
            <div className="center">
              <p className="center text-red margin-top-err">{err}</p>
              <button className="btn-submit" onClick={exchange} disabled={disableSubmit}>
                {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
                Exchange
              </button>
            </div>
        :

            <div className="center margin-top-button">
              <button className="btn-submit" onClick={exchange} disabled={disableSubmit}>
                {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
                Thực hiện
              </button>
            </div>

      }
    </Col>
  )
}

export default swap;
