import Taro from '@tarojs/taro'

export const SYMBOL='alipay_submit_div';

//删除支付宝之前的form表单
export function deleteForm(){
    console.log("===deleteForm===>");

    Taro.showToast({
        icon: 'none',
        title: '我执行了deleteForm操作',
        duration: 15000
    }) 

    let forms=document.getElementsByClassName(SYMBOL);

    while(forms.length){
        Taro.showToast({
            icon: 'none',
            title: '我执行了删除表单操作',
            duration: 15000
        })
   
        document.body.removeChild(forms[0]);
    }
}