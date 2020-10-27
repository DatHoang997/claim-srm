import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button, message } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import './style.scss'

const bounty = () => {
  const dispatch = useDispatch(),
        serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        wallet = useSelector(state => state.claimASRM.wallet),
        [fbId, setFbId] = useState(null),
        [psId, setPsId] = useState(null),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(true),
        [check, setCheck] = useState(''),
        [msg, setMsg] = useState(''),
        [click, setClick] = useState(''),
        [noti, setNoti] = useState(''),
        [claimed, setClaimed] = useState(''),
        claimASRMRedux = store.getRedux('claimASRM').actions

  const claimAsrmService = new ClaimAsrmService()
  let myVar
  let alpha = ''

  useEffect(() => {
    claimAsrmService.getWallet(wallet)
    myVar = setTimeout(go, 5000)

  }, [wallet])

  useEffect(() => {
    if (serverResponse) {
      setDisableSubmit(false)
    }
    if (serverResponse.message == 'claim') {
      claimAsrmService.response(psId)
      message.success('Chúng tôi đã chuyển 300 aSRM, vui lòng quay lại ví nếu bạn muốn kiểm tra')
      setNoti('')
      setClick('')
      setMsg(
        <p>Nhận bounty thành công. Bạn có muốn tiếp tục tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>
      )
      setDisableSubmit(true)
      setClaimed(true)
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
    getCookie('subid')
    getCookie('_ezdref')
    if (alpha) {
      setDisableSubmit(false)
      let data = await claimAsrmService.getUerData(alpha)
      if (data.data.data == true) {
        setCheck(
          <div className="center">
            <p>Bạn đã nhận bounty</p>
          </div>
        )
      }
      if (data.data.data == false) {
        setDisableSubmit(false)
        setClick(
          <p>Mời bạn ấn nhấn nút "Nhận bounty ngay" để chúng tôi chuyển tới bạn 300 aSRM</p>
        )
      }
      setDisableSubmit(data.data.data)
      if (data.data.message == 'not found fb_id') {
        setDisableSubmit(true)
        setNoti(
          <div>
            <p>Bạn chưa đủ điều kiện tham gia vì một trong những lý do sau:</p>
            <p>- Chương trình chỉ áp dụng cho người mới sử dụng ứng dụng ezDeFi</p>
            <p>- Chương trình chỉ áp dụng sau khi bạn đã comment và tag đủ 05 người bạn trên fanpgage</p>
            <p>- Có gián đoạn xảy ra khi bạn tham gia chương trình</p>
            <p>Vui lòng gỡ ứng dụng và click và đường link chúng tôi đã gửi cho bạn qua Messenger</p>
          </div>)
      }
    }
    if (!alpha) {
      setDisableSubmit(true)
      setErr(
        <div>
          <p>Bạn chưa đủ điều kiện tham gia vì một trong những lý do sau:</p>
          <p>- Chương trình chỉ áp dụng cho người mới sử dụng ứng dụng ezDeFi</p>
          <p>- Chương trình chỉ áp dụng sau khi bạn đã comment và tag đủ 05 người bạn trên fanpgage</p>
          <p>- Có gián đoạn xảy ra khi bạn tham gia chương trình</p>
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
      if (name == '_ezdref' && name == cookiePair[0].trim()) {
        setFbId(decodeURIComponent(cookiePair[1]))
        alpha = decodeURIComponent(cookiePair[1])
        dispatch(claimASRMRedux._ezdref_update(cookiePair[1]))
      }
      if (name == 'subid' && name == cookiePair[0].trim()) {
        setPsId(decodeURIComponent(cookiePair[1]))
        dispatch(claimASRMRedux.subid_update(cookiePair[1]))
      }
    }
  }

  return (
    <Col span={24}>
      { (check == '') ?
        <Row>
          <Col span={24} className="center margin-top-md">
            <p className="text-white-light">Wallet Address:</p>
            <p className="text-white-light center">{wallet}</p>
          </Col>
          <Col span={24} className="margin-top-md">
            <div className="text-white-light">{noti}</div>
          </Col>
          <Col span={24} className="margin-top-md center">
            <div className="text-white-light">{click}</div>
          </Col>
          <Col span={24} className="center margin-top-md">
            <h1 className="text-white-light">{msg}</h1>
            { (msg == '') ?
              <div>
                {(disableSubmit == true) ?
                  <span className="text-white-bold"> <LoadingOutlined/></span>
                  :
                  <button className="btn-submit margin-top-md" onClick={claimASRM} disabled={disableSubmit}>
                    <span>Nhận bounty ngay</span>
                  </button>
                }
              </div>
            :
              <p className='roll margin-top-md'><a className="link btn-submit margin-top-md" target='_blank' href='https://m.me/1795330330742938?ref=.f.5f856318817b370012f33e4a'>Tham gia</a></p>
            }
            <p className='text-white-light'>{err}</p>
          </Col>
        </Row>
      :
        <Row>
          <Col span={24} className="margin-top-md">
            <h1 className="text-white-light">{check}</h1>
          </Col>
          <Col span={24} className="center margin-top-md center">
            <p className="text-white-light">Nhận bounty thành công. Bạn có muốn tiếp tục tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>
          </Col>
          <Col span={24} className="margin-top-md center">
            <p className='roll margin-top-md'><a className="link btn-submit margin-top-md" target='_blank' href='https://m.me/1795330330742938?ref=.f.5f856318817b370012f33e4a'>Tham gia</a></p>
          </Col>

        </Row>
      }
    </Col>
  )
}

export default bounty;
