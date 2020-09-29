import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd'
import I18N from '@/I18N'
import './style.scss'
import 'antd/dist/antd.css';

const HeaderComponent = () => {
  return (
    <header>
      <Row>
        <h1>header</h1>
      </Row>
    </header>
  )
}

export default HeaderComponent;
