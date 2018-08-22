
const transfer = {
  // top5 数据翻译
  top5(to, from, type) {
    let attr = 'channels'
    if (type > 2) {
      attr = 'regions'
    }
    let options = this.options2map(from).get(attr)

    to.forEach(el => {
      let temp = options.get(el.id)
      if (temp) {
        el.id = temp
      }
      el.day = `${(el.day * 100).toFixed(2)}%`
    })
  },

  options2map(source) {
    let result = new Map()
    for (let i in source) {
      result.set(i, new Map(source[i].map(el => [el.id, el.name])))
    }
    return result
  },

  // echarts formatter
  getYAxisFormatter(type) {
    switch (type) {
      case 'percent':
        return (value, index) => {
          return `${value * 100}%`
        }
      case 'thousand':
        return (value, index) => {
          if (value >= 1000) {
            value = `${value/1000}k`
          }
          return value
        }
    }
  },

  numFormatter(num, type) {
    if (num === -1 || num === undefined) return '---'
    if (type === 'percent') {
      return `${+(num * 100).toFixed(2)}%`
    }
    return +num.toFixed(2)
  },

//  平台 渠道..数据翻译
  /**
   *
   * @param to 要翻译的数据
   * @param from 基准源数据
   * @param type 平台/渠道/....
   * @param key 字段名
   * @param point 分享页面功能点翻译
   */
  searchOption(to, from, type, key, point) {
    if (to.length > 0 && from.hasOwnProperty(type)) {
      let options = this.options2map(from).get(type)
      to.forEach(el => {
        let temp = options.get(el[key])
        if (temp) {
          el[key] = temp
        }
        if (point) {
          this.sharedPoint(el)
        }
      })
    }
  },

  sharedPoint(item) {
    if (item.point === 9999999) {
      item.point = '总计'
    }
  }
}

export default transfer