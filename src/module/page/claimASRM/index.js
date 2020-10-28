import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button, message } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import { LoadingOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import './style.scss'
import axios from 'axios'
import LuckyWheel from '../../../components/LuckyWheel'
import Form from '../bountyForm/index'

const bounty = () => {
  const dispatch = useDispatch(),
        serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        formResponse = useSelector(state => state.claimASRM.formResponse),
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
        [formLinkSent, setFormLinkSent] = useState(false),
        [formLinkSending, setFormLinkSending] = useState(false),
        [spinNumber, setSpinNumber] = useState(null),
        [user, setUser] = useState(null),
        [form, setForm] = useState(null),
        [joinIn, setJoinIn] = useState(''),
        claimASRMRedux = store.getRedux('claimASRM').actions

  const claimAsrmService = new ClaimAsrmService()
  let myVar
  let alpha = ''
console.log('aaaaaaaaaaaaa', disableSubmit)
  useEffect(() => {
    claimAsrmService.getWallet(wallet)
    myVar = setTimeout(go, 5000)
  }, [wallet])

// console.log('msg',msg)
//   useEffect(() => {
//     claimAsrmService.getInfo(wallet)
//     claimAsrmService.getWallet(wallet)
//   }, [msg])

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
        <p>Nhận bounty thành công. Mời bạn điền thông tin để tiếp tục tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>
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

  useEffect(() => {
    if (formResponse) {
      setUser(form)
      setForm('')
    }
  }, [formResponse])

  const go = async() => {
    getCookie('subid')
    getCookie('_ezdref')

    if(!alpha) {
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
      return
    }

    setDisableSubmit(false)

    let response = await claimAsrmService.getUser(alpha)

    if (response.data.message == 'not found fb_id') {
      setNoti(
        <div>
          <p>Bạn chưa đủ điều kiện tham gia vì một trong những lý do sau:</p>
          <p>- Chương trình chỉ áp dụng cho người mới sử dụng ứng dụng ezDeFi</p>
          <p>- Chương trình chỉ áp dụng sau khi bạn đã comment và tag đủ 05 người bạn trên fanpgage</p>
          <p>- Có gián đoạn xảy ra khi bạn tham gia chương trình</p>
          <p>Vui lòng gỡ ứng dụng và click và đường link chúng tôi đã gửi cho bạn qua Messenger</p>
        </div>
      )
      return
    }

    let user = response.data
    console.log(user)

    setForm(user)

    if(user.claimed == '0') {
      setDisableSubmit(false)
      setClick(
        <p>Mời bạn ấn nhấn nút "Nhận bounty ngay" để chúng tôi chuyển tới bạn 300 aSRM</p>
      )
      return
    }

    setDisableSubmit(true)
    setCheck(
      <div className="center">
        <p>Bạn đã nhận bounty</p>
      </div>
    )
  }

  const claimASRM = async() => {
    setDisableSubmit(true)
    let response = await claimAsrmService.claimASRM(fbId, psId);
    if (response == false) {
      setErr('You must choose Nexty network to claim bounty')
    }
  }

  const join = async() => {
    console.log('join')
    let response = await claimAsrmService.getInfo(wallet);
    console.log(response)
    if (response.message == 'Success') {
      console.log('aaaaa')
      setDisableSubmit('')
      setCheck('')
      setMsg('')
      setNoti('')
      setErr('')
      setJoinIn('1')
      setForm('')
      setUser(response.data)
    }
    if (response.message == 'false') {
      console.log('bbbbb')
      setDisableSubmit('')
      setCheck('')
      setMsg('')
      setNoti('')
      setErr('')
      setJoinIn('1')
      setForm(response.data)
    }
  }

  const sendFormLink = async () => {
    setFormLinkSending(true)
    axios.post(`${process.env.SERVER_URL}/user/send_lucky_wheel`, {
      fbId: fbId
    }).then(function(response) {
      setFormLinkSent(true)
      setFormLinkSending(false)
    }).catch(function(error) {
      setFormLinkSending(false)
      return;
    });
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
          <Col span={24} className="center margin-top-xs">
            <h1 className="text-white-light">{msg}</h1>
            { (msg == '' && noti == '' && err == '' && joinIn == '') ?
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
              ( form ?
                <Row>
                  <Form wallet={wallet} />
                </Row>
                :
                <Row>
                  <Col span={24}>
                    { user &&
                      <LuckyWheel user={user} />
                    }
                  </Col>
                </Row>
              )
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
            <p className="text-white-light">Tham gia chương trình vòng quay may mắn trúng thưởng với cơ hội trúng thưởng iPhone 11 Pro Max</p>
          </Col>
          <Col span={24} className="margin-top-md center">
            <button className="btn-submit margin-top-md" onClick={join}>
              <span>Tham gia</span>
            </button>
          </Col>

        </Row>
      }
    </Col>
  )
}

export default bounty;
