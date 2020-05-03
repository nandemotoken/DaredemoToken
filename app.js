let web3_127

window.onload = ()=>{
    const authereum = new Authereum('mainnet')
    const provider = authereum.getProvider()
    web3_127 = new Web3(provider)
    console.log(web3_127.version)
    await provider.enable()

}

const start = () => {
    window.alert("testo")
}

