let web3_127

window.onload = async ()=>{
    const authereum = new Authereum('mainnet')
    const provider = authereum.getProvider()
    web3_127 = new Web3(provider)
    console.log(web3_127.version)

}

const start = () => {
    window.alert("初回起動約1分の時間がかかります")
    await provider.enable()
}

