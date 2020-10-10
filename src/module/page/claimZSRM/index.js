import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button } from 'antd'
import ClaimZsrmService from '@/service/ClaimZSRMService'
import { LoadingOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css';
import './style.scss'
import { sortedLastIndex } from 'lodash'
import {setupWeb3} from "../../../util/auth";

const stats = () => {
  const dispatch = useDispatch(),
        serverResponse = useSelector(state => state.claimZSRM.serverResponse),
        signatureResponse = useSelector(state => state.claimZSRM.signatureResponse),
        wallet = useSelector(state => state.claimZSRM.wallet),
        [srmAddress, setSrmAddress] = useState(''),
        // [wallet, setWallet] = useState(''),
        [fbId, setFbId] = useState(null),
        [psId, setPsId] = useState(null),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(true)

  const claimZsrmService = new ClaimZsrmService()
  let myVar
  let myWallet
  let alpha = ''
  let beta = ''

  useEffect(() => {
    myVar = setInterval(go, 1000)
    if (window.ethereum) {
      setupWeb3()
    }
  }, [wallet])

  console.log('wallet', wallet)

  const go = () => {
    getCookie('ps_id')
    getCookie('fb_id')
    if (alpha) {
      setDisableSubmit(false)
      clearInterval(myVar)
    }
  }

  useEffect(() => {
    if (serverResponse) {
      // setDisableSubmit(false)
    }
    if (serverResponse.status == 1) {
      claimZsrmService.response(psId)
    }
    if (serverResponse.message === "already claimed") {
      setErr("already claimed")
    }
  }, [serverResponse])

  useEffect(() => {
    if (signatureResponse) {
      // setDisableSubmit(false)
    }
  }, [signatureResponse])

  const claimZSRM = async() => {
    setDisableSubmit(true)
    let response = await claimZsrmService.claimZSRM(fbId, psId);
    if (response == false) {
      setErr('You must choose Nexty network to claim bounty')
    }
  }

  const getCookie = (name) => {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == 'fb_id' && name == cookiePair[0].trim()) {
        setFbId(decodeURIComponent(cookiePair[1]))
        alpha = decodeURIComponent(cookiePair[1])
      }
      if (name == 'ps_id' && name == cookiePair[0].trim()) {
        setPsId(decodeURIComponent(cookiePair[1]))
        beta = decodeURIComponent(cookiePair[1])
      }
    }
  }

  return (
    <StandardPage>
        {/* { wallet ? */}
        <Row>
            <Col span={24} className="center margin-top-md">
              <p>{fbId}</p>
            </Col>
            <Col span={24} className="center margin-top-md">
              <Button type='primary' onClick={claimZSRM} disabled={disableSubmit}>
                {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
                Request bounty
              </Button>
              <p className="center text-red">{err}</p>
            </Col>
          </Row>
        {/* :
          <Col span={24} className="center margin-top-md">
            <h1>refresh to get bounty</h1>
          </Col>
        } */}
    </StandardPage>
  )
}

export default stats;
