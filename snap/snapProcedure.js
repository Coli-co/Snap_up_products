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

// 分發搶購號碼給搶購者
// 預期 snapBox & randomId 的數量要一致，每位搶購者才會分配到對應的號碼
async function getSnapNumber(snapBox, randomId) {
  const pool = await new Pool(configParams)
  const q = Math.floor(randomId.length / 2)
  console.log('q is:', q)
  try {
    for (let i = 0; i < q + 1; i++) {
      // 將 id 區分成奇數、偶數
      let a = 2 * i + 1
      let b = 2 * i

      // 當 index 範圍超出時，代表已經遍歷完所有數字，終止程式執行
      if (a > randomId.length || b === randomId.length) {
        console.log('All client get snap number!')
        return
      }

      // 當 id 數值超出或等於 index 長度時，因為 index 數值跛實際長度小 1，
      // 所以只須更新其中一個 id 的 snapnumber 欄位
      if (a === randomId.length) {
        const text = `
            UPDATE clients  
              SET snapnumber = ${snapBox[b]}
              WHERE id =  ${randomId[b]}
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

module.exports = { generateSnapNumber, randomIdDistribute, getSnapNumber }
