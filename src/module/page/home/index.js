import React, { useEffect, useState } from 'react'
import StandardPage from '../StandardPage'
import { Tabs } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import Bounty from '../claimASRM/index'
import Swap from '../swapSRM/index'
import 'antd/dist/antd.css';
import './style.scss'

const {TabPane} = Tabs;

const home = () => {
  const claimAsrmService = new ClaimAsrmService()

  useEffect(() => {
    claimAsrmService.asrmBalance()
  }, [])

  return (
    <StandardPage>
    <div className="merchant-management-page desktop-padding">
      <img src="assets/images/logo-ezdefi.png" width="120" />
      <h4 className="text-primary left-align padding-left-xs">ezDeFi Bounty tặng ngay 300aSRM và Cơ hội trúng Iphone 11 khi người dùng sử dụng ví ezDeFi Wallet</h4>
      <Tabs>
        <TabPane tab='Nhận aSRM' key="1">
          <Bounty/>
        </TabPane>
        <TabPane tab='Chuyển SRM' key="2">
          <Swap/>
        </TabPane>
      </Tabs>
    </div>
  </StandardPage>
  )
}

export default home;
