module.exports = {
  recordTime: () => {
    let recordTime = ''
    const recordDate = new Date()
    const hours = new Date().getHours()
    const minutes = new Date().getMinutes()
    const seconds = new Date().getSeconds()
    recordTime = `${hours}:${minutes}:${seconds}`
    return [recordDate, recordTime]
  },
  diffTime: (dateOne, dateTwo) => {
    const reqAndResDiff = new Date(dateTwo - dateOne)
    const secDiff = reqAndResDiff.getSeconds()
    const millisecDiff = reqAndResDiff.getMilliseconds()
    return [secDiff, millisecDiff]
  }
}
