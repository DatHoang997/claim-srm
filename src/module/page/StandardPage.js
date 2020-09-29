import React from 'react'
import { Layout, Row, Col } from 'antd'
import Header from '../layout/Header'
import Footer from '../layout/Footer'

const BasePage = (props) => {
  return (
    <Layout className="p_standardPage">
      <Row>
        <Col xs={{span: 24}} sm={{span: 24}} lg={{span: 7}} xl={5} xxl={4}>
          {
            props.noHeader ? '' : <Header/>
          }
        </Col>
        <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} lg={{span: 17}} xl={19} xxl={20}>
          <Layout.Content>
          <div className="main-content">
              {props.children}
          </div>
          </Layout.Content>
        </Col>
        <Col span={24}>
          <Footer />
        </Col>
      </Row>
    </Layout>
  )
}

export default BasePage
