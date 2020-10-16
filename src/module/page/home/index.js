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
      <div>
        <div className="center">
          <img src="../../../assets/images/ezdefi.svg" alt=""/>
        </div>
        <h4 className="center text-white-bold padding-bottom margin-top-md">ezDefi Bounty tặng ngay 300aSRM và cơ hội trúng Iphone 11 khi người dùng sử dụng ezDefi wallet</h4>
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
