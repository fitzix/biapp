
const transfer = {
  // top5 数据翻译
  top5(to, from, type) {
    console.log(from, type)
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
  }
}

export default transfer