import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button, message } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css';
import './style.scss'
import {setupWeb3} from "../../../util/auth";

const bounty = () => {
  const serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        wallet = useSelector(state => state.claimASRM.wallet),
        [fbId, setFbId] = useState(null),
        [psId, setPsId] = useState(null),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(true),
        [check, setCheck] = useState('')

  const claimAsrmService = new ClaimAsrmService()
  let myVar
  let alpha = ''
  let beta = ''

  useEffect(() => {
    myVar = setTimeout(go, 5000)
    if (window.ethereum) {
      setupWeb3()
    }
  }, [wallet])

  useEffect(() => {
    if (serverResponse) {
      setDisableSubmit(false)
    }
    if (serverResponse.status == 1) {
      // claimZsrmService.response(psId)
      message.success('Claim Success')
    }
    if (serverResponse.message === "already claimed") {
      setErr("already claimed")
    }
  }, [serverResponse])

  useEffect(() => {
    if (signatureResponse) {
      setDisableSubmit(false)
    }
  }, [signatureResponse])

  const go = async() => {
    getCookie('ps_id')
    getCookie('fb_id')
    if (alpha) {
      setDisableSubmit(false)
      let data = await claimAsrmService.getUerData(alpha)
      if (data.data.data == true) {
        setCheck(data.data.message)
      }
      setDisableSubmit(data.data.data)
    }
  }

  const claimASRM = async() => {
    setDisableSubmit(true)
    let response = await claimAsrmService.claimASRM(fbId, psId);
    if (response == false) {
      setErr('You must choose Nexty network to claim bounty')
    }
  }

  const getCookie = (name) => {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == 'fb_id' && '_ezdref' == cookiePair[0].trim()) {
        setFbId(decodeURIComponent(cookiePair[1]))
        alpha = decodeURIComponent(cookiePair[1])
      }
      if (name == 'ps_id' && 'subid' == cookiePair[0].trim()) {
        setPsId(decodeURIComponent(cookiePair[1]))
        beta = decodeURIComponent(cookiePair[1])
      }
    }
  }

  return (
    <StandardPage>
        { (check == '') ?
          <Row>
            <Col span={24} className="center margin-top-md">
              <p>Wallet Address: {wallet}</p>
            </Col>
            <Col span={24} className="center margin-top-md">
              {serverResponse.status == 1
              ? <div>
                <p className="margin-bot-md">Nhận bounty thành công. Bạn có muốn tiếp tục tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>
                <p><a class='ant-btn ant-btn-primary btn-submit' target='_blank' href='https://m.me/1795330330742938?ref=.f.5f856318817b370012f33e4a'>Tham gia</a></p>
                </div>
              : <button className="btn-submit" onClick={claimASRM} disabled={disableSubmit}>
                  {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
                  Nhận bounty ngay
                </button>
              }
              <p className="center text-red">{err}</p>
            </Col>
          </Row>
        :
          <Col span={24} className="center margin-top-md">
            <p className="margin-bot-md">Nhận bounty thành công. Bạn có muốn tiếp tục tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>
            <p><a class='ant-btn ant-btn-primary btn-submit' target='_blank' href='https://m.me/1795330330742938?ref=.f.5f856318817b370012f33e4a'>Tham gia</a></p>
          </Col>
        }
    </StandardPage>
  )
}

export default bounty;
