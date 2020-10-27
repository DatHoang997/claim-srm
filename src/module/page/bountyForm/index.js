import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Input, Row, Col, Button, message } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import {thousands, weiToPOC, hideAddress, hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'
import _ from 'lodash'
import 'antd/dist/antd.css';
import './style.scss'

const swap = () => {
  const serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        balance = useSelector(state => state.claimASRM.balance),
        wallet = useSelector(state => state.claimASRM.wallet),
        reduxName = useSelector(state => state.claimASRM.name),
        reduxAddress = useSelector(state => state.claimASRM.address),
        reduxPhone = useSelector(state => state.claimASRM.phone),
        reduxViettel = useSelector(state => state.claimASRM.viettel),
        [srmAddress, setSrmAddress] = useState(''),
        [fbId, setFbId] = useState(''),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(true),
        [disableInput, setDisableInput] = useState(false),
        [asrmAmount, setAsrmAmount] = useState(''),
        [name, setName] = useState(''),
        [address, setAddress] = useState(''),
        [phoneNumber, setPhoneNumber] = useState(''),
        [viettiel, setViettel] = useState(''),
        [reward, setReward] = useState('')

  const claimAsrmService = new ClaimAsrmService()

  const regexp = {
    NUM: /^[0-9]+(\.[0-9]+)?$/
  }

  useEffect(() => {
    claimAsrmService.getInfo(wallet)
  }, [])

  useEffect(() => {
    if (reduxName != '') {
      setDisableInput(true)
    }
  }, [reduxName])

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
    if (name == '' || address == '' || phoneNumber == '' || reward == '') {
      setErr('vui lòng điền đầy đủ thông tin')
      setDisableSubmit(true)
    } else {
      let response = await claimAsrmService.insertInformation(name, address, phoneNumber, reward, wallet);
      if (response.status == 1) {
        setDisableSubmit(false)
        setName('')
        setAddress('')
        setPhoneNumber('')
        setViettel('')
        setReward('')
        message.success('Gửi thông tin thành công')
      }
      if (response.message == 'filled') {
        setDisableSubmit(false)
        setName('')
        setAddress('')
        setPhoneNumber('')
        setViettel('')
        setReward('')
        setErr('Tài khoản này đã được điền thông tin')
      }
      if (response.message == 'false') {
        setDisableSubmit(false)
        setName('')
        setAddress('')
        setPhoneNumber('')
        setViettel('')
        setReward('')
        setErr('Đã sảy ra lỗi')
      }
      if (response.message == 'wrong') {
        setDisableSubmit(false)
        setName('')
        setAddress('')
        setPhoneNumber('')
        setViettel('')
        setReward('')
        setErr('Không tìm thấy ví')
      }
    }
  }

  const getReward = (e) => {
    setDisableSubmit(false)
    if (regexp.NUM.test(e.target.value) || e.target.value == '') {
      setPhoneNumber(e.target.value)
      if (viettiel == '') {
        setReward(e.target.value)
      }
    }
  }

  const getViettelNumber = (e) => {
    setDisableSubmit(false)
    if (regexp.NUM.test(e.target.value) || e.target.value == '') {
      setReward(e.target.value)
      setViettel(e.target.value)
    }
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
              <Input type="text" className="swap-input" value={name} placeholder={reduxName} onChange={(e)=>{setName(e.target.value), setDisableSubmit(false)}} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label">
              <p className="text-white-light">Địa chỉ</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" value={address} placeholder={reduxAddress} onChange={(e)=>{setAddress(e.target.value), setDisableSubmit(false)}} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label">
              <p className="text-white-light">SĐT</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" placeholder={reduxPhone} value={phoneNumber} onChange={getReward} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={7} className="label-card">
              <p className="text-white-light">SĐT nhận thẻ cào</p>
            </Col>
            <Col span={17}>
              <Input type="text" className="swap-input" placeholder={reduxViettel} value={reward} onChange={getViettelNumber} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        { (reduxName == '') ?
          <Col span={24} className="center margin-top-button">
            <Row>
              <Col span={7}></Col>
              <Col span={17}>
                <button className="btn-submit" onClick={insert} disabled={disableSubmit}>
                  {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
                  Thực hiện
                </button>
                <p className='text-white-bold'>{err}</p>
              </Col>
            </Row>
          </Col>
          :
          <Col span={24} className="center margin-top-button">
          <Row>
            <Col span={7}></Col>
            <Col span={17}>
              <button className="btn-submit-disable" onClick={insert} disabled={disableSubmit}>
                Thực hiện
              </button>
              <p className='text-white-bold'>{err}</p>
            </Col>
          </Row>
        </Col>
        }
      </Row>
    </Col>
  )
}

export default swap;
