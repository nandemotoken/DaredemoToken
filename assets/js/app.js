let web3_127
let authereum
let provider
let nav_wait_on = false
let myaddress
let userinfo
let my_ens_addr
const tokenAddresses = []
const contractNameMap = {}
const contractDecimalMap = {}

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
    document.getElementById('twitter').style.visibility = "visible"
    document.getElementById('address').style.visibility = "visible"
    myaddress = await authereum.getAccountAddress()
    userinfo = await authereum.authenticate()
    my_ens_addr = userinfo.account.username + '.auth.eth'
    document.getElementById('addressinfo').innerText = my_ens_addr
    document.getElementById('address').addEventListener("mouseover",(e)=>{document.getElementById('addressIcon').style.color= "rgb(20,33,47);";document.getElementById('addressinfo').style.color= "rgb(20,33,47);"})
    document.getElementById('address').addEventListener("mouseleave",(e)=>{document.getElementById('addressIcon').style.color= "rgb(0,118,255)";document.getElementById('addressinfo').style.color= "rgb(0,118,255)"})
    document.getElementById('twitter').addEventListener("mouseover",(e)=>{document.getElementById('twitterIcon').style.color= "rgb(0,118,255)"})
    document.getElementById('twitter').addEventListener("mouseleave",(e)=>{document.getElementById('twitterIcon').style.color= "rgb(143,149,156)"})
    displayTokenList()
}

const displayTokenList = async () => {
    delete_token_table()
    const d = await $.getJSON(`https://api.etherscan.io/api?module=account&action=tokentx&address=${myaddress}&startblock=0&endblock=999999999&sort=asc&apikey=9RKFJU66918PAHA44HS5W3PJGPBQCMA3P3`)
    // console.log(d)
    // console.log(d.result)
    // d.result.forEach( e => console.log(e))
    // d.result.forEach( e => console.log(e.contractAddress))
    d.result.forEach( e => {
        tokenAddresses.push(e.contractAddress)
        contractNameMap[e.contractAddress] = e.tokenName
        contractDecimalMap[e.contractAddress] = e.tokenDecimal
        // console.log(e.contractAddress)
    })
    const tokenAddressSet = new Set(tokenAddresses)

    // console.log(tokenAddressSet)
    tokenAddressSet.forEach( async myTokenContractInfo => {
        // console.log(myTokenContractAddr)
        const g = await $.getJSON(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${myTokenContractInfo}&address=${myaddress}&tag=latest&apikey=9RKFJU66918PAHA44HS5W3PJGPBQCMA3P3`)
        // console.log(g)
        // console.log(contractSymbolMap[myTokenContractInfo])
        // console.log(contractDecimalMap[myTokenContractInfo])
        // console.log(g.result/ Math.pow( 10, contractDecimalMap[myTokenContractInfo]) )
        add_token_table( contractNameMap[myTokenContractInfo] , g.result/ Math.pow( 10, contractDecimalMap[myTokenContractInfo]) )
    } )
    // t()
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
    // newRow.insertCell().appendChild(document.createTextNode("送信"))
    let t_button = document.createElement("button")
    t_button.textContent = "送信"
    newRow.insertCell().appendChild(t_button)
}

const delete_token_table = () => {
    while( document.getElementById('token_table').rows.length > 1 ){
    document.getElementById('token_table').deleteRow(1)
}
}

const make_token = async ()=>{
    let ans = window.confirm(`${document.getElementById('token_name').value}を作成します`)
    if  (ans) {
    await makeToken( document.getElementById('token_name').value , "DT" )
}
}

const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "createrAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			}
		],
		"name": "create",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


const createToken = async ( token , symbol ) => {
    const tokenFactory = '0x360df9bd3adaea972e0365869e556277a20987bd'
    const instance = await new web3_127.eth.Contract(abi, tokenFactory)
    
    const from = (await web3_127.eth.getAccounts())[0]
    
    const { transactionHash } = await instance.methods.create(from, token , symbol ).send({ from })

}

const makeDT = () => {
    createToken( "A010" , "DT" )
}

const makeToken = async ( name , symbol ) => {
    await createToken( name , symbol )
    refleshTokenList()
    document.getElementById('navtxt').innerText = "2分ほど待つと作成したトークンが画面に反映されます"
}

const refleshTokenList = () =>{
    for (let i in [6,12,18,24,36,48,60]){
        setTimeout(() => {
            displayTokenList()
        }, i*5000);        
    }
}

const twitterLink = () => {
    // window.open('https://twitter.com/share?url=https://nandemotoken.github.io/DaredemoToken/', '_blank')
    window.open(`https://twitter.com/share?text=だれでもトークンはじめました！私のアドレスは『${my_ens_addr}』です。&hashtags=だれでもトークン,ブロックチェーン,仮想通貨&url=https://nandemotoken.github.io/DaredemoToken/`, '_blank')
}

const ensaddress = () => {
    const addarea = document.createElement("textarea");
    addarea.textContent = my_ens_addr
    document.getElementsByTagName("body")[0].appendChild(addarea)
    addarea.select()
    document.execCommand("copy")
    document.getElementsByTagName("body")[0].removeChild(addarea)
    window.alert("クリップボードにアドレスをコピーしました\n\n※メールアドレスのように使えます")
}
