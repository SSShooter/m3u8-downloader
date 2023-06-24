import https from 'https'

const req = https.request(
  'https://production.fc-member.stream2.johnnys-net.jp/fc-member/230622_p_mbd_3mfv/hdntl=exp=1687662440~acl=%2f*~data=hdntl~hmac=b7a37127106028880230cea1cf5d08c945599f53abc35ca52eaa852af0e623a0/230622_p_mbd_3mfv00000.ts',
  {
    method: 'GET',
    headers: {
      Origin: 'https://www.fc-member.johnnys-net.jp',
      Referer: 'https://www.fc-member.johnnys-net.jp/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    },
  },
  (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      console.log('req.getHeaders()', req.getHeaders())
      console.log(`BODY: ${chunk}`)
    })
    res.on('end', () => {
      console.log('No more data in response.')
    })
  }
)
req.on('error', (e) => {
  console.log('req.getHeaders()', req.getHeaders())
  console.error(e)
})
req.end()
