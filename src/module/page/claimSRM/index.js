import React, { useEffect, useState } from 'react'
import StandardPage from '../StandardPage'
import { Input, Row, Col, Button } from 'antd'
import 'antd/dist/antd.css';
import './style.scss'

const stats = () => {
  const [srmAddress, setSrmAddress] = useState('')

  const claimSRM = () => {

  }
  console.log(srmAddress)
  return (
    <StandardPage>
      <Row>
        <Col span='4'></Col>
        <Col span='20'>
          <p>SRM address:</p>
        </Col>
      </Row>
      <Row>
        <Col span='4'></Col>
        <Col span='10'>
          <Input onChange={(e) => {setSrmAddress(e.target.value);}} />
        </Col>
        <Col span='1'></Col>
        <Col span='4'>
          <Button type='primary' onClick={claimSRM}>Submit</Button>
        </Col>
      </Row>
    </StandardPage>
  )
}

export default stats;
