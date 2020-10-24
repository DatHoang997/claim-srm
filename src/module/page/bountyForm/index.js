import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Input, Row, Col, Button, message } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import {thousands, weiToPOC, hideAddress, hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'
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
        [name, setName] = useState(''),
        [address, setAddress] = useState(''),
        [phoneNumber, setPhoneNumber] = useState(''),
        [viettiel, setViettel] = useState(''),
        [reward, setReward] = useState('')

  const claimAsrmService = new ClaimAsrmService()

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

  const insert = async() => {
    setDisableSubmit(true)
    setErr('')
    console.log(name, address, phoneNumber, reward, wallet)
    if (name == '' || address == '' || phoneNumber == '' || reward == '') {
      setErr('vui lòng điền đầy đủ thông tin')
      setDisableSubmit(true)
    } else {
      console.log('@@@@@')
      let response = await claimAsrmService.insertInformation(name, address, phoneNumber, reward, wallet);
      if (response.data.status ==1) {
        setDisableSubmit(false)
        setName('')
        setAddress('')
        setPhoneNumber('')
        setViettel('')
        setReward('')
        message.success('Gửi thông tin thành công')
      }
    }
  }

  const getReward = (e) => {
    setPhoneNumber(e.target.value)
    if (viettiel == '') {
      setReward(e.target.value)
    }
  }

  const getViettelNumber = (e) => {
    setReward(e.target.value)
    setViettel(e.target.value)
  }

  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          <div className="margin-top-sm center">
            <span>
              <h3 className="text-white-bold">Điền Thông tin</h3>
            </span>
          </div>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label">
              <p className="text-white-light">Họ tên</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" value={name} onChange={(e)=>{setName(e.target.value)}}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label">
              <p className="text-white-light">Địa chỉ</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label">
              <p className="text-white-light">SĐT</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" value={phoneNumber} onChange={getReward}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label-card">
              <p className="text-white-light">SĐT nhận thẻ cào</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" value={reward} onChange={getViettelNumber}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="center margin-top-button">
          <button className="btn-submit" onClick={insert} disabled={disableSubmit}>
            {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
            Thực hiện
          </button>
        </Col>
      </Row>
    </Col>
  )
}

export default swap;
