import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button } from 'antd'
import ClaimZsrmService from '@/service/ClaimZSRMService'
import { LoadingOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css';
import './style.scss'

const stats = () => {
  const dispatch = useDispatch(),
        serverResponse = useSelector(state => state.claimZSRM.serverResponse),
        signatureResponse = useSelector(state => state.claimZSRM.signatureResponse),
        [srmAddress, setSrmAddress] = useState(''),
        [fbId, setFbId] = useState(''),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(false)

  const claimZsrmService = new ClaimZsrmService()

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

  const claimZSRM = async() => {
    setDisableSubmit(true)
    let response = await claimZsrmService.claimZSRM(fbId, srmAddress);
    console.log('response', response)
  }

  return (
    <StandardPage>
      <Row>
        <Col xs={{span: 1}} sm={{span: 2}} lg={{span: 4}} xl={{span: 4}} xxl={{span: 4}}></Col>
        <Col xs={{span: 23}} sm={{span: 22}} lg={{span: 20}} xl={{span: 20}} xxl={{span: 20}}>
          <p>ZSRM address:</p>
        </Col>
      </Row>
      <Row>
        <Col xs={{span: 1}} sm={{span: 2}} lg={{span: 4}} xl={{span: 4}} xxl={{span: 4}}></Col>
        <Col xs={{span: 14}} sm={{span: 13}} lg={{span: 10}} xl={{span: 10}} xxl={{span: 10}}>
          <Input onChange={(e) => {setSrmAddress(e.target.value);}} />
        </Col>
        <Col xs={{span: 1}} sm={{span: 1}} lg={{span: 1}} xl={{span: 1}} xxl={{span: 1}}></Col>
        <Col>
          <Button type='primary' onClick={claimZSRM} disabled={disableSubmit}>
          {disableSubmit && <span className="margin-right-sm"> <LoadingOutlined/></span>}
          Submit
          </Button>
        </Col>
      </Row>
    </StandardPage>
  )
}

export default stats;
