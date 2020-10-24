import React, { useState, useEffect } from 'react'
import Winwheel from 'winwheel'
import { TweenMax } from 'gsap/TweenMax'
import axios from 'axios'
import luckyWheelImage from '../assets/images/lucky-wheel.png';
import { Button } from 'antd'

const LuckyWheel = () => {
  const [spinNumber, setSpinNumber] = useState(3)
  const [prize, setPrize] = useState(null)
  const [wheel, setWheel] = useState(null)

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
    console.log(window);
    setDefaultWheel();
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
        'spins': 8
      }
    });
    let image = new Image();
    image.onload = function() {
      wheel.wheelImage = image;
      wheel.draw();
    }
    image.src = luckyWheelImage;
    setWheel(wheel);
  }

  const spin = async () => {
    let url = `${process.env.SERVER_URL}/minigame`;
    let response = await axios.post(url);
    let prize = response.data.message.name;
    console.log(prize)
    setPrize(prize)
    let segmentIndex = segments.findIndex((segment) => segment.text === prize);
    let stopAt;
    if(!segmentIndex) {
      stopAt = wheel.getRandomForSegment(3)
    } else {
      stopAt = wheel.getRandomForSegment(segmentIndex + 1)
    }
    wheel.animation.stopAngle = stopAt;
    wheel.startAnimation();
  }

  const shareOnFB = () => {
    FB.ui({
      method: 'share',
      href: 'https://developers.facebook.com/docs/'
    }, function(response){
      console.log('share response', response);
    });
  }

  const luckyWheelStyle = {
    position: 'relative', 
    width: '600px'
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
    <p>Số lượt quay: {spinNumber}</p>
    <Button onClick={shareOnFB} type="primary">Share on Facebook</Button>
    {(prize) ? <p>{prize}</p> : <p>Chưa quay</p>}
    <Button type="primary" onClick={setDefaultWheel}>Reset</Button>
    </div>
    </div>
  )
}

export default LuckyWheel