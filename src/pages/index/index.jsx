import Taro, { useState } from "@tarojs/taro";
import goodsList from "../../config/goodsList";
import WaterFall from "./WaterFall";

export default () => {
  const [data, setData] = useState(goodsList);
  const onScrollToUpper = e => {
    console.log(e);
  };
  const onScrollToLower = e => {
    console.log(e);
    setData([...data, ...goodsList]);
  };
  const onScroll = e => {
    console.log(e);
  };
  return (
    <WaterFall
      data={data}
      onScroll={onScroll}
      onScrollToLower={onScrollToLower}
      onScrollToUpper={onScrollToUpper}
    />
  );
};
