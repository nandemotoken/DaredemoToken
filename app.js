let web3_127
let authereum
let provider

window.onload = async ()=>{
    authereum = new Authereum('mainnet')
    provider = authereum.getProvider()
    web3_127 = new Web3(provider)
    console.log(web3_127.version)

}

const start = async () => {
    window.alert("初回起動約1分の時間がかかります")
    await provider.enable()
}

const check = async() => {
    window.alert(provider.isConnected())
}

