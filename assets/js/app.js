let web3_127
let authereum
let provider
let nav_wait_on = false
let myaddress
const tokenAddresses = []


window.onload = async ()=>{
    authereum = new Authereum('mainnet')
    provider = authereum.getProvider()
    web3_127 = new Web3(provider)
    console.log(web3_127.version)
    document.getElementById('reg').style.visibility = "visible"
    document.getElementById('navtxt').innerText = "STARTボタンを押してユーザ登録(完全無料)"
}

const start = async () => {
    document.getElementById('reg').src = "./assets/img/button_start2.png"
    document.getElementById('navtxt').innerText = "リンク先にメールアドレスとパスワードを登録下さい"
    nav_wait_on = true
    nav_waiting()
    await provider.enable()
    nav_wait_on = false
    document.getElementById('token_name_space').style.visibility = "visible"
    document.getElementById('navtxt').innerText = "トークン名を入力して作成ボタンを押す"
    document.getElementById('make').style.visibility = "visible"
    myaddress = await authereum.getAccountAddress()
    displayTokenList()
}

const displayTokenList = async () => {
    const d = await $.getJSON(`https://api.etherscan.io/api?module=account&action=tokentx&address=${myaddress}&startblock=0&endblock=999999999&sort=asc&apikey=9RKFJU66918PAHA44HS5W3PJGPBQCMA3P3`)
    // console.log(d)
    // console.log(d.result)
    // d.result.forEach( e => console.log(e))
    // d.result.forEach( e => console.log(e.contractAddress))
    d.result.forEach( e => {
        tokenAddresses.push(e.contractAddress)
        console.log(e.contractAddress)
    })
    t()
}


const check = async() => {
    window.alert(provider.isConnected())
}

const nav_hidari = () => {
    document.getElementById('navimg').style = "position: fixed; bottom: 0px; right: 0px; width: 20%; transform: scale(-1, 1);"
}

const nav_migi = () => {
    document.getElementById('navimg').style = "position: fixed; bottom: 0px; right: 0px; width: 20%; transform: scale(1, 1);"
}

const nav_waiting = () => {
    setTimeout(nav_migi,500)
    setTimeout(nav_hidari,1000)
    setTimeout( () => {if (nav_wait_on) {nav_waiting()}}, 1000)
}

const t = ()=>{
    add_token_table('トークン名',100)
}

const add_token_table = (t_name,t_count)=>{
    const newRow = document.getElementById('token_table').insertRow()
    newRow.insertCell().appendChild(document.createTextNode(t_name))
    newRow.insertCell().appendChild(document.createTextNode(t_count))
}

const make_token = ()=>{
    window.alert(document.getElementById('token_name').value)
}