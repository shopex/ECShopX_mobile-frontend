 
import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View,Text } from '@tarojs/components'
import { useState,useEffect } from 'react'; 
import { updateState} from "@/store/slices/merchant";
import { SpSearchBar } from '@/components'
import api from '@/api'
import { usePage, useDepChange } from '@/hooks'
import { useSelector, useDispatch } from 'react-redux'
import { AUDITING,AUDIT_SUCCESS,AUDIT_FAIL,AUDIT_UNKNOWN,AUDIT_MAP_IMG,AUDIT_MAP_TITLE,AUDIT_MAP_RENDER } from './consts'
import { MButton, MStep, MNavBar, MCell,MImgPicker } from './comps'
import { SpImage,Loading } from '@/components';
import './audit.scss'
import { classNames,styleNames,getThemeStyle } from '@/utils';

const Audit = () => { 

    const [status,setStatus]=useState(0)

    const getAuditStatus=async ()=>{
        const { audit_status } = await api.merchant.getAuditstatus();
        setStatus(audit_status)
    }

    const renderIng=<View className='text'>预计会在1～5个工作日完成审核</View>;

    const renderSuccess=<View className='text success'>登录地址及账号密码将发送短信至注册手机号，请注意查收</View>

    const renderFail=<View className='block'>
        <View className='text'>审批意见：</View>
        <View className='text'>· 法人手持身份证照片有误，需重新上传；</View>
        <View className='text'>· 审批意见审批意见审批意见，审批意见审批意见，审批意见审批意见。</View>
    </View>

    useEffect(() => {
        getAuditStatus()
    }, [])

    return (
        <View className={classNames('page-merchant-audit')}  style={styleNames(getThemeStyle())}>
           
           <MNavBar canBack={false}   />

            {status==AUDIT_UNKNOWN ? <Loading /> : <SpImage src={AUDIT_MAP_IMG[status]} className={'status-img'} />}

            <View className='status-title'>{[AUDIT_MAP_TITLE[status]]}</View>

            <View className='status-info'>
                {status==AUDITING && renderIng}
                {status==AUDIT_SUCCESS && renderSuccess}
                {status==AUDIT_FAIL && renderFail}
            </View>

        </View>
    )
}


export default Audit;
