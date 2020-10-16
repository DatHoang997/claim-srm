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
        [check, setCheck] = useState(''),
        [msg, setMsg] = useState(''),
        [noti, setNoti] = useState('')

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
      setNoti('')
      setMsg(<p>Nhận bounty thành công. Bạn có muốn tiếp tục tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>)
      setDisableSubmit(true)
    }
    if (serverResponse.message === "already claimed") {
      setErr("Bạn đã được nhận thưởng")
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
        setCheck(
          <div>
            <p>Bạn chưa đủ điều kiện tham gia vì một trong những lý do sau:</p>
            <p>  - Chương trình chỉ áp dụng cho người mới sử dụng ứng dụng ezDeFi</p>
            <p>  - Chương trình chỉ áp dụng sau khi bạn đã comment và tag đủ 05 người bạn trên fanpgage</p>
            <p>  - Có gián đoạn xảy ra khi bạn tham gia chương trình</p>
            <p>Vui lòng gỡ ứng dụng và click và đường link chúng tôi đã gửi cho bạn qua Messenger</p>
          </div>
        )
      }

      if (data.data.data == false) {
        console.log(data.data)
        setNoti(<p>{data.data.message}</p>)
      }
      setDisableSubmit(data.data.data)
    }
    if (!alpha) {
      setDisableSubmit(true)
      setErr(
        <div>
          <p>Bạn chưa đủ điều kiện tham gia vì một trong những lý do sau:</p>
          <p>  - Chương trình chỉ áp dụng cho người mới sử dụng ứng dụng ezDeFi</p>
          <p>  - Chương trình chỉ áp dụng sau khi bạn đã comment và tag đủ 05 người bạn trên fanpgage</p>
          <p>  - Có gián đoạn xảy ra khi bạn tham gia chương trình</p>
          <p>Vui lòng gỡ ứng dụng và click và đường link chúng tôi đã gửi cho bạn qua Messenger</p>
        </div>
      )
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
    <Col span={24}>
      { (check == '') ?
        <Row>
          <Col span={24} className="center margin-top-md">
            <p className="text-white-light">Wallet Address:</p>
            <a className="text-white-light center">{wallet}</a>
          </Col>
          <Col span={24} className="center margin-top-md">
            <h1 className="text-white-light">{msg}</h1>
            <h1 className="text-white-light">{noti}</h1>
            <button className="btn-submit margin-top-md" onClick={claimASRM} disabled={disableSubmit}>
              {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
              Nhận bounty ngay
            </button>
            <p className="center text-red">{err}</p>
          </Col>
        </Row>
      :
        <Row>
          <Col span={24} className="margin-top-md center">
            <button className="btn-submit" onClick={claimASRM} disabled={disableSubmit}>
              {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
              Nhận bounty ngay
            </button>
          </Col>
          <Col span={24} className="margin-top-md">
            <h1 className="text-red">{check}</h1>
          </Col>
        </Row>
      }
    </Col>
  )
}

export default bounty;
