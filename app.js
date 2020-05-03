let web3_127
let authereum
let provider
let navwaiting = false

window.onload = async ()=>{
    authereum = new Authereum('mainnet')
    provider = authereum.getProvider()
    web3_127 = new Web3(provider)
    console.log(web3_127.version)
    document.getElementById('reg').style.visibility = "visible"
}

const start = async () => {
    // window.alert("初回起動約1分の時間がかかります")
    document.getElementById('reg').src = "./button_start2.png"
    await provider.enable()
    document.getElementById('chk').style.visibility = "visible"
}

const check = async() => {
    window.alert(provider.isConnected())
}

const nav_hidari = () => {
    document.getElementById('nav').style = "position: absolute; bottom: 0px; right: 0px; width: 20%; transform: scale(-1, 1);"
}

const nav_migi = () => {
    document.getElementById('nav').style = "position: absolute; bottom: 0px; right: 0px; width: 20%; transform: scale(1, 1);"
}

const nav_waiting = () => {
    setInterval(nav_migi,500)
    setInterval(nav_hidari,1000)
}

