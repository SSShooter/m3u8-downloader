import { writeFile, appendFile, mkdir, rm, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { argv } from 'node:process'

const headers = {
  accept: '*/*',
  'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8,ja-JP;q=0.7,ja;q=0.6',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  Referer: 'https://www.fc-member.johnnys-net.jp/',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
}
const options = {
  headers,
  body: null,
  method: 'GET',
}
async function loadList(url) {
  const res = await fetch(url, {
    headers,
    body: null,
    method: 'GET',
  })
  const text = await res.text()
  console.log(text)
}
const urlPrefix = argv[3]
const chunk = argv[2]
const regexp = /([0-9a-z_]+)(.m3u8)?$/
const fileName = urlPrefix.match(regexp)[1]

async function load(i) {
  const index = String(i).padStart(5, 0)
  const url = `${urlPrefix}${index}.ts`

  console.log('start fetching ' + index)
  const res = await fetch(url, options)
  const size = res.headers.get('content-length')
  console.log('Total size: ' + size)

  const reader = res.body.getReader()

  // infinite loop while the body is downloading
  let count = 0
  let data = new Uint8Array()
  while (true) {
    // done is true for the last chunk
    // value is Uint8Array of the chunk bytes
    const { done, value } = await reader.read()

    if (done) {
      break
    }
    let newdata = new Uint8Array(data.length + value.length)
    newdata.set(data)
    newdata.set(value, data.length)
    data = newdata

    process.stdout.write('\r\x1b[K')
    count += value.length
    process.stdout.write(`Received ${((count / size) * 100).toFixed(2)}%`)
  }
  return data
}

async function download() {
  console.log('start downloading')
  console.log('urlPrefix: ' + urlPrefix)
  console.log('chunk:'+ chunk)
  try {
    await mkdir(`./${fileName}`)
  } catch (err) {
    // do nothing
  }
  await rm(`./${fileName}/merge.ts`, { force: true })
  for (let i = 0; i < chunk; i++) {
    let data = null
    const fileUrl = `./${fileName}/${i}.ts`
    if (existsSync(fileUrl)) {
      data = await readFile(fileUrl)
      console.log(`\n${i} had done, use cache`)
    } else {
      data = await load(i)
      await appendFile(fileUrl, data)
      console.log(`\n${i} had downloaded`)
    }
    console.log(`\n------------------\n`)
    await appendFile(`./${fileName}/merge.ts`, data)
  }
  console.log(`File had successfully merged!`)
}

download()