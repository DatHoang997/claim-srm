import React from 'react'
import { Layout, Row, Col } from 'antd'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

const BasePage = (props) => {
  return (
    <Layout className="p_standardPage">
      <Row>
        {/* <Col xs={{span: 24}} sm={{span: 24}} lg={{span: 24}} xl={{span: 24}} xxl={{span: 24}}>
          {
            props.noHeader ? '' : <Header/>
          }
        </Col> */}
        <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 24}} xl={{span: 24}} xxl={{span: 24}} className="background">
          <Layout.Content>
          <div className="main-content">
              {props.children}
          </div>
          </Layout.Content>
          <div className='bottom-home'/>
        </Col>
        <Col span={24}>
          <Footer />
        </Col>
      </Row>
    </Layout>
  )
}

export default BasePage
