const { Pool } = require('pg')
const configParams = require('../config/pg')

let snapBox = [] //搶購號碼
let checkIdBox = [] //id檢查箱，用以檢查重複號碼

// fixedNumber : 固定搶購名額，actualNumber: 實際搶購名額
async function generateSnapNumber(fixedNumber, actualNumber) {
  const pool = await new Pool(configParams)
  // 記錄搶購號碼
  try {
    for (let i = 0; i < fixedNumber; i++) {
      const value = await pool.query(`SELECT nextval('order_id')`)
      // console.log('value is:', value.rows[0].nextval)
      const snapNumber = value.rows[0].nextval

      await snapBox.push(snapNumber)
      if (Number(snapNumber) === fixedNumber) {
        const overNumber = actualNumber - fixedNumber

        for (let j = 0; j < overNumber; j++) {
          snapBox.push('0')
        }

        return snapBox
      }
    }
  } catch (err) {
    console.log('Run out of snap number!')
    console.log(err)
    return
  }
}

// 隨機 id -> 隨機搶購者
async function randomIdDistribute(times) {
  for (let i = 0; i < times; i++) {
    const randomId = Math.floor(Math.random() * 100) + 1
    await checkIdBox.push(randomId)
  }

  const checkId = new Set()
  // 替換重複 id
  checkIdBox.forEach((id, index) => {
    while (checkId.has(id)) {
      checkIdBox[index] = id = Math.floor(Math.random() * 100) + 1
    }
    checkId.add(id)
  })
  return checkIdBox
}

//  分發搶購號碼給搶購者
// snapBox & randomId 的數量要一致，每位搶購者才會分配到對應的號碼
async function getSnapNumber(snapBox, randomId) {
  const pool = await new Pool(configParams)
  for (let i = 0; i < randomId.length; i++) {
    const text = `
            UPDATE clients AS t 
              SET snapnumber = c.ca
              FROM (values
                (${snapBox[i]}, ${randomId[i]}),
                (${snapBox[i + 1]}, ${randomId[i + 1]})  
              ) as c(ca, cb) 
            WHERE c.cb = t.id;
            `
    await pool.query(text)
  }
  console.log('All client get snap number!')
}

module.exports = { generateSnapNumber, randomIdDistribute, getSnapNumber }
