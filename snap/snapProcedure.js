const { Pool } = require('pg')
const configParams = require('../config/pg')
const insertClientData = require('../models/seeds/clientSeeder')
const snapSequence = require('../sequences/orderId')

let snapBox = [] //搶購號碼
let checkIdBox = [] //id檢查箱，用以檢查重複號碼

// fixedNumber : 固定搶購名額，actualNumber: 實際搶購名額
async function generateSnapNumber(fixedNumber, actualNumber) {
  const pool = await new Pool(configParams)
  // 記錄搶購號碼
  try {
    for (let i = 0; i < fixedNumber; i++) {
      const value = await pool.query(`SELECT nextval('order_id')`)
      const snapNumber = value.rows[0].nextval
      snapBox.push(snapNumber)
      // 超出搶購號碼，領到的號碼為 0
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

// 隨機 id -> 產生隨機搶購者
async function randomIdDistribute(times) {
  for (let i = 0; i < times; i++) {
    const randomId = Math.floor(Math.random() * times) + 1
    await checkIdBox.push(randomId)
  }

  const checkId = new Set()
  // 替換重複 id
  checkIdBox.forEach((id, index) => {
    while (checkId.has(id)) {
      checkIdBox[index] = id = Math.floor(Math.random() * times) + 1
    }
    checkId.add(id)
  })
  return checkIdBox
}

// 分發搶購號碼給搶購者
// 預期 snapBox & randomId 的數量要一致，每位搶購者才會分配到對應的號碼
async function getSnapNumber(snapBox, randomId) {
  const pool = await new Pool(configParams)
  const q = Math.floor(randomId.length / 2)

  try {
    for (let i = 0; i < q + 1; i++) {
      // 將 id 區分成奇數、偶數
      let a = 2 * i + 1
      let b = 2 * i

      // 當 index 範圍超出時，代表已經遍歷完所有數字，終止程式執行
      if (a > randomId.length || b > randomId.length) {
        console.log('All client get snap number!')
        return
      }

      // 當 index 數值超出或等於 index 長度時，且其中一方的 index 等於 randomId 的最後 index 位置，就只須更新其 index 上 id 的 snapnumber 欄位
      if (a >= randomId.length && b === randomId.length - 1) {
        const text = `
            UPDATE clients  
              SET snapnumber = ${snapBox[b]}
              WHERE id =  ${randomId[b]}
            `
        await pool.query(text)
        console.log('All client get snap number!')
        return
      }

      if (b >= randomId.length && a === randomId.length - 1) {
        const text = `
            UPDATE clients  
              SET snapnumber = ${snapBox[a]}
              WHERE id =  ${randomId[a]}
            `
        await pool.query(text)
        console.log('All client get snap number!')
        return
      }

      if (i === 0) {
        const text = `
            UPDATE clients AS t 
              SET snapnumber = c.ca
              FROM (values
                ('1', ${randomId[0]}),
                ('2', ${randomId[1]})  
              ) as c(ca, cb) 
            WHERE c.cb = t.id;
            `
        pool.query(text)
      }
      const text = `
            UPDATE clients AS t 
              SET snapnumber = c.ca
              FROM (values
                (${snapBox[b]}, ${randomId[b]}),
                (${snapBox[a]}, ${randomId[a]})  
              ) as c(ca, cb) 
            WHERE c.cb = t.id;
            `
      await pool.query(text)
    }
  } catch (err) {
    console.log(err)
  }
}

// async function test() {
//   await insertClientData(150)
//   await snapSequence(60)
//   const snapBox = await generateSnapNumber(60, 150)
//   const randomIdGroup = await randomIdDistribute(150)
//   await getSnapNumber(snapBox, randomIdGroup)
// }

// test()

module.exports = { generateSnapNumber, randomIdDistribute, getSnapNumber }
