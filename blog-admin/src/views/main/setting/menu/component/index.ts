import icons from '@icon-park/vue-next/icons.json'

export interface optionsF {
  id?: number
  title?: string
  name?: string
  category?: string
  categoryCN?: string
  author?: string
  tag?: string[]
  rtl?: boolean
}

export interface iconF {
  category: string
  categoryCN: string
  options: optionsF[]
}

const iconsF = icons.filter(
  (s) =>
    s.category === 'Base' ||
    s.category === 'Office' ||
    s.category === 'Edit' ||
    s.category === 'Abstract' ||
    s.category === 'Money' ||
    s.category === 'Music' ||
    s.category === 'Peoples'
)

// 获取部分图标
export const iconList = (): Promise<any[]> => {
  return new Promise((resolve, _reject) => {
    const arr: iconF[] = [
      {
        category: 'Base',
        categoryCN: '基础',
        options: []
      },
      // {
      //   category: 'Safe',
      //   categoryCN: '安全 & 防护',
      //   options: []
      // },
      {
        category: 'Office',
        categoryCN: '办公文档',
        options: []
      },
      {
        category: 'Edit',
        categoryCN: '编辑',
        options: []
      },
      // {
      //   category: 'Emoji',
      //   categoryCN: '表情',
      //   options: []
      // },
      // {
      //   category: 'Measurement',
      //   categoryCN: '测量 & 试验',
      //   options: []
      // },
      {
        category: 'Abstract',
        categoryCN: '抽象图形',
        options: []
      },
      {
        category: 'Money',
        categoryCN: '电商财产',
        options: []
      },
      // {
      //   category: 'Animals',
      //   categoryCN: '动物',
      //   options: []
      // },
      {
        category: 'Music',
        categoryCN: '多媒体音乐',
        options: []
      },
      // {
      //   category: 'Clothes',
      //   categoryCN: '服饰',
      //   options: []
      // },
      // {
      //   category: 'Character',
      //   categoryCN: '符号标识',
      //   options: []
      // },
      // {
      //   category: 'Industry',
      //   categoryCN: '工业',
      //   options: []
      // },
      // {
      //   category: 'Makeups',
      //   categoryCN: '化妆美妆',
      //   options: []
      // },
      // {
      //   category: 'Graphics',
      //   categoryCN: '几何图形',
      //   options: []
      // },
      // {
      //   category: 'Build',
      //   categoryCN: '建筑',
      //   options: []
      // },
      // {
      //   category: 'Arrows',
      //   categoryCN: '箭头方向',
      //   options: []
      // },
      // {
      //   category: 'Communicate',
      //   categoryCN: '交流沟通',
      //   options: []
      // },
      // {
      //   category: 'Travel',
      //   categoryCN: '交通旅游',
      //   options: []
      // },
      // {
      //   category: 'Components',
      //   categoryCN: '界面组件',
      //   options: []
      // },
      // {
      //   category: 'Connect',
      //   categoryCN: '链接',
      //   options: []
      // },
      // {
      //   category: 'Operate',
      //   categoryCN: '美颜调整',
      //   options: []
      // },
      // {
      //   category: 'Baby',
      //   categoryCN: '母婴儿童',
      //   options: []
      // },
      // {
      //   category: 'Energy',
      //   categoryCN: '能源 & 生命',
      //   options: []
      // },
      // {
      //   category: 'Brand',
      //   categoryCN: '品牌',
      //   options: []
      // },
      // {
      //   category: 'Life',
      //   categoryCN: '生活',
      //   options: []
      // },
      // {
      //   category: 'Time',
      //   categoryCN: '时间日期',
      //   options: []
      // },
      // {
      //   category: 'Foods',
      //   categoryCN: '食品',
      //   options: []
      // },
      // {
      //   category: 'Hands',
      //   categoryCN: '手势动作',
      //   options: []
      // },
      // {
      //   category: 'Datas',
      //   categoryCN: '数据',
      //   options: []
      // },
      // {
      //   category: 'Charts',
      //   categoryCN: '数据图表',
      //   options: []
      // },
      // {
      //   category: 'Sports',
      //   categoryCN: '体育运动',
      //   options: []
      // },
      // {
      //   category: 'Weather',
      //   categoryCN: '天气',
      //   options: []
      // },
      // {
      //   category: 'Constellation',
      //   categoryCN: '星座',
      //   options: []
      // },
      // {
      //   category: 'Health',
      //   categoryCN: '医疗健康',
      //   options: []
      // },
      // {
      //   category: 'Hardware',
      //   categoryCN: '硬件',
      //   options: []
      // },
      {
        category: 'Peoples',
        categoryCN: '用户人名',
        options: []
      }
      // {
      //   category: 'Game',
      //   categoryCN: '游戏',
      //   options: []
      // },
      // {
      //   category: 'Others',
      //   categoryCN: '其它',
      //   options: []
      // }
    ]
    arr.forEach((s: any) => {
      iconsF.forEach((is) => {
        if (s.category === is.category) {
          s.options.push(is)
        }
      })
    })
    resolve(arr)
  })
}

export const getCategoryList = () => {
  let arr: iconF[] = [
    {
      category: 'Base',
      categoryCN: '基础',
      options: []
    },
    {
      category: 'Safe',
      categoryCN: '安全 & 防护',
      options: []
    },
    {
      category: 'Office',
      categoryCN: '办公文档',
      options: []
    },
    {
      category: 'Edit',
      categoryCN: '编辑',
      options: []
    },
    {
      category: 'Emoji',
      categoryCN: '表情',
      options: []
    },
    {
      category: 'Measurement',
      categoryCN: '测量 & 试验',
      options: []
    },
    {
      category: 'Abstract',
      categoryCN: '抽象图形',
      options: []
    },
    {
      category: 'Money',
      categoryCN: '电商财产',
      options: []
    },
    {
      category: 'Animals',
      categoryCN: '动物',
      options: []
    },
    {
      category: 'Music',
      categoryCN: '多媒体音乐',
      options: []
    },
    {
      category: 'Clothes',
      categoryCN: '服饰',
      options: []
    },
    {
      category: 'Character',
      categoryCN: '符号标识',
      options: []
    },
    {
      category: 'Industry',
      categoryCN: '工业',
      options: []
    },
    {
      category: 'Makeups',
      categoryCN: '化妆美妆',
      options: []
    },
    {
      category: 'Graphics',
      categoryCN: '几何图形',
      options: []
    },
    {
      category: 'Build',
      categoryCN: '建筑',
      options: []
    },
    {
      category: 'Arrows',
      categoryCN: '箭头方向',
      options: []
    },
    {
      category: 'Communicate',
      categoryCN: '交流沟通',
      options: []
    },
    {
      category: 'Travel',
      categoryCN: '交通旅游',
      options: []
    },
    {
      category: 'Components',
      categoryCN: '界面组件',
      options: []
    },
    {
      category: 'Connect',
      categoryCN: '链接',
      options: []
    },
    {
      category: 'Operate',
      categoryCN: '美颜调整',
      options: []
    },
    {
      category: 'Baby',
      categoryCN: '母婴儿童',
      options: []
    },
    {
      category: 'Energy',
      categoryCN: '能源 & 生命',
      options: []
    },
    {
      category: 'Brand',
      categoryCN: '品牌',
      options: []
    },
    {
      category: 'Life',
      categoryCN: '生活',
      options: []
    },
    {
      category: 'Time',
      categoryCN: '时间日期',
      options: []
    },
    {
      category: 'Foods',
      categoryCN: '食品',
      options: []
    },
    {
      category: 'Hands',
      categoryCN: '手势动作',
      options: []
    },
    {
      category: 'Datas',
      categoryCN: '数据',
      options: []
    },
    {
      category: 'Charts',
      categoryCN: '数据图表',
      options: []
    },
    {
      category: 'Sports',
      categoryCN: '体育运动',
      options: []
    },
    {
      category: 'Weather',
      categoryCN: '天气',
      options: []
    },
    {
      category: 'Constellation',
      categoryCN: '星座',
      options: []
    },
    {
      category: 'Health',
      categoryCN: '医疗健康',
      options: []
    },
    {
      category: 'Hardware',
      categoryCN: '硬件',
      options: []
    },
    {
      category: 'Peoples',
      categoryCN: '用户人名',
      options: []
    },
    {
      category: 'Game',
      categoryCN: '游戏',
      options: []
    },
    {
      category: 'Others',
      categoryCN: '其它',
      options: []
    }
  ]
  return arr
}

const whileFun = (arr: any, iconF: iconF[]) => {
  arr.forEach((s: any) => {
    iconF.forEach((is) => {
      if (s.category === is.category) {
        s.options.push(is)
      }
    })
  })
}

// 获取全部图标
export const iconAll = (categoryVal?: any, val?: any): Promise<any[]> => {
  return new Promise((resolve, _reject) => {
    let iconF: any[] = icons
    let data
    if (categoryVal === 'all') {
      let arr = getCategoryList()
      // 标识和名称搜索
      if (val) {
        iconF = iconF.filter(
          (s) =>
            s.category.includes(val) ||
            s.categoryCN.includes(val) ||
            s.title.includes(val) ||
            s.name.includes(val) ||
            s.category === val ||
            s.categoryCN === val ||
            s.title === val ||
            s.name === val
        )
      }
      whileFun(arr, iconF)
      data = arr
    } else {
      let arr = getCategoryList()
      whileFun(arr, iconF)
      // 分类搜索
      arr = arr.filter((s) => s.category === categoryVal)
      // 标识和名称搜索
      if (val) {
        arr.forEach((s) => {
          s.options = s.options.filter(
            (s) =>
              s.name === val ||
              s.name?.includes(val) ||
              s.title === val ||
              s.title?.includes(val)
          )
        })
        arr = arr.filter((s) => s.options.length > 0)
      }
      data = arr
    }
    setTimeout(() => {
      resolve(data)
    }, 1500)
  })
}
