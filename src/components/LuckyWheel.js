import React, { useState, useEffect } from 'react'
import Winwheel from 'winwheel'
import { TweenMax } from 'gsap/TweenMax'
import axios from 'axios'
import luckyWheelImage from '../assets/images/lucky-wheel.png';
import { Button, Modal, notification } from 'antd'

const LuckyWheel = (props) => {
  console.log(props.user)
  const [spinning, setSpinning] = useState(false)
  const [spinNumber, setSpinNumber] = useState(null)
  const [prize, setPrize] = useState(null)
  const [wheel, setWheel] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)

  const segments = [
    {'text' : 'iPhone 11 Pro Max'},
    {'text' : 'Thẻ Viettel 10K'},
    {'text' : 'Mất lượt'},
    {'text' : 'Thẻ Viettel 20K'},
    {'text' : 'Mất lượt'},
    {'text' : 'Thẻ Viettel 50K'},
    {'text' : 'Thẻ Viettel 100K'},
    {'text' : 'Mất lượt'}
  ]

  useEffect(() => {
    window.TweenMax = TweenMax
    window.showPrize = showPrize
    setDefaultWheel();
    setSpinNumber(props.user.spin_number)
  }, []);

  const setDefaultWheel = () => {
    let wheel = new Winwheel({
      'canvasId': 'canvas',
      'numSegments': 8,
      'drawMode': 'image',
      'drawText': false,
      'segments': segments,
      'animation': {
        'type': 'spinToStop',
        'duration': 5,
        'spins': 8,
        'callbackFinished': 'showPrize()'
      },
    });
    let image = new Image();
    image.onload = function() {
      wheel.wheelImage = image;
      wheel.draw();
    }
    image.src = luckyWheelImage;
    setWheel(wheel);
  }

  const showPrize = () => {
    setSpinning(false)
    setShowModal(true)
  }

  const spin = async () => {
    if(spinNumber == 0 || spinning) {
      return
    }
    setSpinning(true)
    let url = `${process.env.SERVER_URL}/minigame`
    let response
    try {
      response = await axios.post(url, {
        fb_id: props.user.fb_id
      });
    } catch(error) {
      openNotification('Đã có lỗi xảy ra. Vui lòng thử lại', 'error')
      return
    }
    setSpinNumber(response.data.spin_number)
    let prize = response.data.prize;
    setPrize(prize)
    let segmentIndex = segments.findIndex((segment) => segment.text === prize);
    wheel.animation.stopAngle = (segmentIndex) ? wheel.getRandomForSegment(segmentIndex + 1) : wheel.getRandomForSegment(3);
    wheel.startAnimation();
  }

  const shareOnFB = () => {
    let server_url = process.env.SERVER_URL.replace('api', '');
    FB.ui({
      method: 'share',
      href: `${server_url}/ref/${props.user.fb_id}`,
    }, function(response){
      if(response === undefined) {
        openNotification('Chia sẻ liên kết thất bại. Vui lòng thử lại', 'error')
      } else {
        openNotification('Chia sẻ liên kết thành công. Bạn sẽ được thêm lượt quay sau khi bạn bè click vào liên hết mà bạn chia sẻ', 'info')
      }
      console.log('share response', response);
    });
  }

  const onHideModal = () => {
    setShowModal(false)
    setPrize(null)
    setDefaultWheel()
  }

  const openNotification = (message, type) => {
    if(type === 'error') {
      notification.error({
        message,
        placement: 'bottomRight'
      });
    } else {
      notification.info({
        message,
        placement: 'bottomRight'
      });
    }
  };

  const luckyWheelStyle = {
    position: 'relative', 
    width: '600px',
    margin: '0 auto'
  }

  const luckyWheelPointerStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '14px',
    width: '100px'
  }

  const luckyWheelButtonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    cursor: 'pointer',
  }

  return(
    <div>
      <div id="lucky-wheel" style={luckyWheelStyle}>
        <canvas id="canvas" width="600" height="600" />
        <img style={luckyWheelPointerStyle} src="https://blog-bbh.s3.ap-southeast-1.amazonaws.com/Asset%207f4-1571513553.png" />
        <img style={luckyWheelButtonStyle} onClick={spin} src="https://blog-bbh.s3.ap-southeast-1.amazonaws.com/N%C3%9AT-%C4%90%E1%BA%B8P-1572492667.png" />
      </div>
      <div style={{color: 'white'}}>
        { (spinNumber > 0) ?
          <div>
            <p>Bạn có {spinNumber} lượt quay</p>
            <Button onClick={spin} type="primary">Quay ngay</Button>
          </div>
        :
          <div>
            <p>Bạn đã hết lượt quay. Click vào button phía dưới để gửi link chia sẻ tới bạn bè. Bạn sẽ được cộng lượt quay sau khi bạn bè click vào link.</p>
            <Button onClick={shareOnFB} type="primary">Chia sẻ liên kết</Button>
          </div>
        }
      </div>
      { prize && 
        <Modal visible={showModal} onCancel={onHideModal} footer={null}>
          <p>Phần thưởng của bạn là:</p>
          <p><strong>{prize}</strong></p>
        </Modal> 
      }
    </div>
  )
}

export default LuckyWheel