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
      <h3 className="text-primary left-align padding-left-xs">EzDefi Bounty</h3>
      <Tabs>
        <TabPane tab='Bounty' key="1">
          <Bounty/>
        </TabPane>
        <TabPane tab='Swap' key="2">
          <Swap/>
        </TabPane>
      </Tabs>
    </div>
  </StandardPage>
  )
}

export default home;
