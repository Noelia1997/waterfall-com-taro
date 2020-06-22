import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView, Image} from '@tarojs/components'
import goodsList from "../../config/goodsList";
import './index.css'



let ImageLoadList = []
export default class Good extends Component {

  config = {
    navigationBarTitleText: 'Good'
  }
  state = {

    data: [],
    lenght: goodsList.length,
    goodsLeft: [],
    goodsRight: [],
    ImageLoadList: [],
    imgWidth: 0

  }

  componentWillMount() {
    Taro.getSystemInfo({
      success: (res => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.5;

        this.setState({
          imgWidth
        })
      })
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onImageLoad = (e) => {
    console.log(e.currentTarget.id)
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.state.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    //初始化ImageLoadList数据
    ImageLoadList.push({
      id: parseInt(e.currentTarget.id),
      height: imgHeight,
    })
    //载入全部的图片进入ImageLoadList数组，若数量和goodsList中相等，进入图片排序函数
    if (ImageLoadList.length === goodsList.length) {
      this.handleImageLoad(ImageLoadList)
    }
    // console.log(ImageLoadList)
  }
  handleImageLoad = (ImageLoadList) => {
    console.log('hello', ImageLoadList)
    //对无序的列表进行排序
    for (let i = 0; i < ImageLoadList.length - 1; i++)
      for (let j = 0; j < ImageLoadList.length - i - 1; j++) {
        if (ImageLoadList[j].id > ImageLoadList[j + 1].id) {
          let temp = ImageLoadList[j]
          ImageLoadList[j] = ImageLoadList[j + 1]
          ImageLoadList[j + 1] = temp
        }
      }
    //现在的列表在goodList的基础上，多了height属性
    console.log('ImageLoadList', ImageLoadList);
    //为现在的列表添加value值

    for (let i = 0; i < goodsList.length; i++) {
      ImageLoadList[i].value = goodsList[i].value
      ImageLoadList[i].image = goodsList[i].image
      console.log('ImageLoadList[i].height', ImageLoadList[i].height)
      ImageLoadList[i].imgStyle = {height: ImageLoadList[i].height + 'rpx'}

    }
    console.log('ImageLoadList', ImageLoadList);
    //对现在的列表进行操作
    let leftHeight = 0;
    let rightHeight = 0;
    let left = []
    let right = []
    //遍历数组
    for (let i = 0; i < ImageLoadList.length; i++) {
      console.log('左边的高度', leftHeight, '右边边的高度', rightHeight)
      if (leftHeight <= rightHeight) {
        console.log('第', i + 1, '张放左边了')
        left.push(ImageLoadList[i])
        leftHeight += ImageLoadList[i].height
        console.log('left', left);
      } else {
        console.log('第', i + 1, '张放右边了')
        right.push(ImageLoadList[i])
        rightHeight += ImageLoadList[i].height
        console.log('right', right);
      }
    }
    this.setState({
      goodsRight: right,
      goodsLeft: left
    }, () => {
      console.log(this.state);
    })
  }

  render() {
    const {goodsRight, goodsLeft} = this.state
    console.log(this.state)
    return (
      <View className={'goods'}>
        <View style={{display: 'none'}}>
          {
            goodsList.map((item, index) => {
              return (
                <Image onLoad={this.onImageLoad} id={index} src={item.image}></Image>
              )
            })
          }
        </View>

        <ScrollView>
          {
            <View className={'goods-left'}>
              {
                goodsLeft.map((item, index) => {
                  return (
                    <View className={'goods-item'}>
                      <Image src={item.image} className={'goods-img'} style={item.imgStyle} id={index}
                             mode='widthFix'/>
                      <View className={'goods-name'}>{item.value}</View>
                    </View>
                  )
                })
              }
            </View>
          }
        </ScrollView>

        <ScrollView>
          {
            <View className={'goods-right'}>
              {
                goodsRight.map((item, index) => {
                  return (
                    <View className={'goods-item'}>
                      <Image src={item.image} className={'goods-img'} style={item.imgStyle} id={index}
                             mode='widthFix'/>
                      <View className={'goods-name'}>{item.value}</View>
                    </View>
                  )
                })
              }
            </View>
          }
        </ScrollView>

      </View>
    )

  }
}
