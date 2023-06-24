$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
Invoke-WebRequest -UseBasicParsing -Uri "https://production.fc-member.stream2.johnnys-net.jp/fc-member/230622_p_mbd_3mfv/hdntl=exp=1687662440~acl=%2f*~data=hdntl~hmac=b7a37127106028880230cea1cf5d08c945599f53abc35ca52eaa852af0e623a0/230622_p_mbd_3mfv00000.ts" `
-WebSession $session `
-Headers @{
  "method"="GET"

  "origin"="https://www.fc-member.johnnys-net.jp"
  "referer"="https://www.fc-member.johnnys-net.jp/"
}