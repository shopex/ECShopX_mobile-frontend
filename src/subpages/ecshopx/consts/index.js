//plusValue 代表正序 minusValue代表倒序
const TIME_SORT=0;
const SALE_PLUS_SORT=4;
const SALE_MINUS_SORT=3;
const DISTANCE_PLUS_SORT=1;
const DISTANCE_MINUS_SORT=2;

export const FILTER_DATA=[
    {value:TIME_SORT,label:'综合排序'},
    {label:'销量',plusValue:SALE_PLUS_SORT,minusValue:SALE_MINUS_SORT},
    {label:'距离',plusValue:DISTANCE_PLUS_SORT,minusValue:DISTANCE_MINUS_SORT}
];

export const DEFAULT_SORT_VALUE=DISTANCE_PLUS_SORT;

export const FILTER_DRAWER_DATA=[
    {
        value:'type',
        label:'商家类型',
        children:[
            {
                value:'1',
                label:'商家类型',
            },
            {
                value:'2',
                label:'超市',
            },
            {
                value:'3',
                label:'商家类型',
            },
            {
                value:'4',
                label:'美妆',
            },
            {
                value:'5',
                label:'外框左右空24px',
            },
            {
                value:'6',
                label:'商家类型商家类型商家类',
            },
            {
                value:'7',
                label:'商家类型',
            },
            {
                value:'8',
                label:'母婴',
            },
            {
                value:'9',
                label:'商家类型商家类型商家',
            },
            {
                value:'10',
                label:'商家类型',
            },
            {
                value:'11',
                label:'商家类型',
            },
            {
                value:'12',
                label:'商家类型',
            },
            {
                value:'13',
                label:'商家类型',
            },
        ]
    },
    {
        value:'service',
        label:'商家服务',
        children:[
            {
                value:'1',
                label:'自提',
            },
            {
                value:'2',
                label:'快递',
            },
            {
                value:'3',
                label:'同城配',
            }
        ]
    }, 
];

export const SEARCH_DATA=[
    '可乐',
    '香氛蜡烛',
    '收纳',
    '坚果零食', 
    '酸奶', 
    '外框左右空24px', 
]