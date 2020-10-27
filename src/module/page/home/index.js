import React, { useEffect, useState } from 'react'
import StandardPage from '../StandardPage'
import { Tabs } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import Bounty from '../claimASRM/index'
import Swap from '../swapSRM/index'
import 'antd/dist/antd.css';
import './style.scss'
import LuckyWheel from '../../../components/LuckyWheel'

const {TabPane} = Tabs;

const home = () => {
  const claimAsrmService = new ClaimAsrmService()

  useEffect(() => {
    claimAsrmService.asrmBalance()
  }, [])

  return (
    <StandardPage>
      <div>
        <div className="center margin-top-md">
          <img src="../../../assets/images/ezdefi.svg" alt=""/>
        </div>
        <h4 className="center text-white-bold padding-bottom margin-top-md">ezDeFi Bounty tặng ngay 300aSRM và cơ hội trúng Iphone 11 Pro Max khi người dùng sử dụng ezDeFi Wallet</h4>
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
