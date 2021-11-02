import { useState } from '@tarojs/taro'

export default () => {
  const [] = useState( {
    page: 1,
    pageSize: 10
  } )

  const nextPage = () => {
    
  }
  
  return {
    pagination,
    nextPage
  };
}