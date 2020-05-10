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
    console.log(`web3.js version is ${web3_127.version}`)
    console.log(`authereum version is ${authereum.version()}`)
    document.getElementById('reg').style.visibility = "visible"
    document.getElementById('navtxt').innerText = "STARTボタンを押してユーザ登録(完全無料)"

    document.getElementById('info').addEventListener("mouseover",(e)=>{document.getElementById('infoIcon').style.color= "rgb(0,118,255)"})
    document.getElementById('info').addEventListener("mouseleave",(e)=>{document.getElementById('infoIcon').style.color= "rgb(143,149,156)"})    

    document.getElementById('token_name').addEventListener('input',()=>{changeTokenName()})
    document.getElementById('token_Symbol').addEventListener('input',()=>{changeTokenName()})
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
    document.getElementById('address').addEventListener("mouseover",(e)=>{document.getElementById('addressIcon').style.color= "rgb(20,33,47)";document.getElementById('addressinfo').style.color= "rgb(20,33,47)"})
    document.getElementById('address').addEventListener("mouseleave",(e)=>{document.getElementById('addressIcon').style.color= "rgb(143,149,156)";document.getElementById('addressinfo').style.color= "rgb(143,149,156)"})
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
        add_token_table( contractNameMap[myTokenContractInfo] , g.result/ Math.pow( 10, contractDecimalMap[myTokenContractInfo]) ,myTokenContractInfo )
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

const add_token_table = (t_name, t_count, t_contract)=>{
    let newRow = document.getElementById('token_table').insertRow()
    newRow.insertCell().appendChild(document.createTextNode(t_name))
    newRow.insertCell().appendChild(document.createTextNode(t_count))
    // newRow.insertCell().appendChild(document.createTextNode("送信"))
    // let t_button = document.createElement("button")
    let t_button = document.createElement("a")
    t_button.classList.add("btn")
    t_button.classList.add("btn-warning")
    t_button.innerText = "送信"
    t_button.href = `javascript:send_token("${t_contract}")`
    newRow.insertCell().appendChild(t_button)
}

const delete_token_table = () => {
    while( document.getElementById('token_table').rows.length > 0 ){
    document.getElementById('token_table').deleteRow(0)
}
}

const make_token = async ()=>{
    let ans = window.confirm(`${document.getElementById('TokenName').innerText}を作成します`)
    if  (ans) {
        nav_wait_on = true
        nav_waiting()
        window.alert(`トークン作成には2分ほど時間がかかります。\n作成中のトークンのことをtwitterで知らせましょう！`)
        window.open(`https://twitter.com/share?text=だれでもトークンはじめました！\n私のアドレスは『${my_ens_addr}』\n${document.getElementById('TokenName').innerText}を作成中です。&hashtags=だれでもトークン,ブロックチェーン&url=https://nandemotoken.github.io/DaredemoToken/`, '_blank')
        document.getElementById('navtxt').innerText = "ブロックチェーン処理途中は右上に文字が出ます。\nそのまま2分ほどお待ちください…"
        await makeToken( document.getElementById('token_name').value , document.getElementById('token_Symbol').value )
        document.getElementById('navtxt').innerText = "もうすぐでトークンが完成します…"
        setTimeout(()=>{
            document.getElementById('navtxt').innerText = "トークンの名前が反映されるのに少し時間がかかります"
        },30000)
        setTimeout(()=>{
            document.getElementById('navtxt').innerText = "作成したトークンを他の人にも送ってみましょう！"
        },60000)
    }
}

const send_token = async (tokenContractAddress)=> {
    const tokenqty = window.prompt("トークンをいくつ送りますか")
    if (!tokenqty) return;
    let tokenTo = window.prompt("トークンの送り先アドレスを貼り付けてください")
    if (!tokenTo) return;
    const conf = window.confirm(`${contractNameMap[tokenContractAddress]}を\n${tokenqty}個\n${tokenTo}へ送ります`)
    if (!conf) return;
    const tokenABI = [{
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }]
    if (tokenTo.match(/eth$/)) {
        tokenTo = await web3_127.eth.ens.getAddress(tokenTo)
    }
    console.log(tokenTo)
    nav_wait_on = true
    nav_waiting()
    document.getElementById('navtxt').innerText = "トークン送信処理中…"
    const tokeninstance = await new web3_127.eth.Contract(tokenABI,tokenContractAddress)
    const { txhash } = await tokeninstance.methods.transfer(tokenTo , tokenqty).send({from: myaddress})
    refleshTokenList()
    document.getElementById('navtxt').innerText = "2分程度でトークン送信が反映されます"
    nav_wait_on = false
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
    nav_wait_on = false
    document.getElementById('navtxt').innerText = "2分ほど待つと作成したトークンが画面に反映されます"
}

const refleshTokenList = () =>{
    for (let i in [6,12,18,24,30,36,42,48,54,60,66,72,78,84,90,96,102,108,114,120]){
        setTimeout(() => {
            displayTokenList()
        }, i*5000);        
    }
}

const twitterLink = () => {
    // window.open('https://twitter.com/share?url=https://nandemotoken.github.io/DaredemoToken/', '_blank')
    window.open(`https://twitter.com/share?text=だれでもトークンはじめました！\n私のアドレスは『${my_ens_addr}』です。&hashtags=だれでもトークン,ブロックチェーン&url=https://nandemotoken.github.io/DaredemoToken/`, '_blank')
}

const ensaddress = () => {
    const addarea = document.createElement("textarea");
    addarea.textContent = my_ens_addr
    document.getElementsByTagName("body")[0].appendChild(addarea)
    addarea.select()
    document.execCommand("copy")
    document.getElementsByTagName("body")[0].removeChild(addarea)
    const ans = window.confirm("クリップボードにアドレスをコピーしました\n※メールアドレスのように使えます\n\nブロックチェーン情報を表示しますか？")
    if (ans) {
        window.open(`https://etherscan.io/address/${myaddress}#tokentxns`, '_blank')        
    }
}

const changeTokenName = () =>{
    document.getElementById("TokenName").innerText = `${document.getElementById("token_name").value}(${document.getElementById("token_Symbol").value})`
}



