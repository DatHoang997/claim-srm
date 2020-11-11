import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Input, Row, Col, Button, message } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import {thousands, weiToPOC, hideAddress, hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'
import _ from 'lodash'
import 'antd/dist/antd.css';
import './style.scss'

const swap = (props) => {
  const serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        balance = useSelector(state => state.claimASRM.balance),
        // wallet = useSelector(state => state.claimASRM.wallet),
        [srmAddress, setSrmAddress] = useState(''),
        [fbId, setFbId] = useState(''),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(false),
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
    // claimAsrmService.getInfo(props.wallet)
  }, [])


  const insert = async() => {
    setDisableSubmit(true)
    setErr('')
    if (name == '' || address == '' || phoneNumber == '' || reward == '') {
      setErr('vui lòng điền đầy đủ thông tin')
      setDisableSubmit(false)
    } else {
      let response = await claimAsrmService.insertInformation(name, address, phoneNumber, reward, props.wallet);
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
              <h3 className="text-white-bold">Điền Thông tin:</h3>
              <p className='text-white-bold'>{err}</p>
            </span>
          </div>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={24} className="label left-align">
              <p className="text-white-light">Họ tên:</p>
            </Col>
            <Col span={24} className="margin-top-xs">
              <Input type="text" className="swap-input" value={name} onChange={(e)=>{setName(e.target.value), setDisableSubmit(false)}} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={24} className="label left-align">
              <p className="text-white-light">Địa chỉ:</p>
            </Col>
            <Col span={24} className="margin-top-xs">
              <Input type="text" className="swap-input" value={address} onChange={(e)=>{setAddress(e.target.value), setDisableSubmit(false)}} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={24} className="label left-align">
              <p className="text-white-light">SĐT:</p>
            </Col>
            <Col span={24} className="margin-top-xs">
              <Input type="text" className="swap-input" value={phoneNumber} onChange={getReward} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="margin-top-md">
          <Row>
            <Col span={24} className="label left-align">
              <p className="text-white-light">SĐT (Viettel) nhận thẻ cào:</p>
            </Col>
            <Col span={24} className="margin-top-xs">
              <Input type="text" className="swap-input" value={reward} onChange={getViettelNumber} disabled={disableInput}/>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="center margin-top-button">
          <Row>
            <Col span={24}>
              <button className="btn-submit" onClick={insert} disabled={disableSubmit}>
                {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
                Thực hiện
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  )
}

export default swap;
