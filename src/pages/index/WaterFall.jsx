import Taro, { useState, useDidShow, useEffect } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import "./index.css";

let ImageLoadList = [];
export default props => {
  const { data, onScrollToLower, onScrollToUpper, onScroll } = props;
  const [winHeight, setWinHeight] = useState(0);
  const [goodsLeft, setGoodsLeft] = useState([]);
  const [goodsRight, setGoodsRight] = useState([]);
  const [leftHeight, setLeftHeight] = useState(0);
  const [rightHeight, setRightHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);

  useDidShow(() => {
    Taro.getSystemInfo({
      success: res => {
        const { windowWidth, windowHeight } = res;
        setImgWidth(windowWidth * 0.5);
        setWinHeight(windowHeight);
      }
    });
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const onImageLoad = e => {
    const { width, height } = e.detail; //图片原始宽度|图片原始高度
    const scale = imgWidth / width; //比例计算
    const imgHeight = height * scale; //自适应高度

    ImageLoadList.push({
      id: parseInt(e.currentTarget.id),
      height: imgHeight
    });
    if (ImageLoadList.length === data.length) {
      handleImageLoad(ImageLoadList);
    }
  };

  const handleImageLoad = ImageLoadList => {
    ImageLoadList.sort((a, b) => (a.id > b.id ? 1 : -1));
    data.forEach((v, i) => {
      ImageLoadList[i].value = data[i].value;
      ImageLoadList[i].image = data[i].image;
      ImageLoadList[i].imgStyle = { height: ImageLoadList[i].height + "rpx" };
    });
    console.log("ImageLoadList", ImageLoadList);
    //对现在的列表进行操作
    let left = [];
    let right = [];
    let left_H = leftHeight;
    let right_H = rightHeight;
    ImageLoadList.forEach((v, i) => {
      if (left_H <= right_H) {
        left.push(v);
        left_H += v.height;
      } else {
        right.push(v);
        right_H += v.height;
      }
      setGoodsLeft([...goodsLeft, ...left]);
      setGoodsRight([...goodsRight, ...right]);
      setLeftHeight(left_H);
      setRightHeight(right_H);
    });
  };
  return (
    <ScrollView
      scrollY
      enableFlex
      scrollWithAnimation
      scrollTop={0}
      Threshold={20}
      onScroll={onScroll}
      onScrollToUpper={onScrollToUpper}
      onScrollToLower={onScrollToLower}
      style={{ display: "flex", height: `${winHeight}px` }}
    >
      <View style={{ display: "none" }}>
        {data
          ? data.map((v, i) => {
              return <Image onLoad={onImageLoad} id={i} src={v.image}></Image>;
            })
          : null}
      </View>
      <View className={"goods-left"}>
        {goodsLeft.map((v, i) => (
          <View className={"goods-item"}>
            <Image
              src={v.image}
              className={"goods-img"}
              style={v.imgStyle}
              id={i}
              mode="widthFix"
            />
            <View className={"goods-name"}>{v.value}</View>
          </View>
        ))}
      </View>
      <View className={"goods-right"}>
        {goodsRight.map((v, i) => (
          <View className={"goods-item"}>
            <Image
              src={v.image}
              className={"goods-img"}
              style={v.imgStyle}
              id={i}
              mode="widthFix"
            />
            <View className={"goods-name"}>{v.value}</View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
