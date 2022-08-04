const symbol = require('/node_modules/symbol-sdk')

//Test Net
//  const GENERATION_HASH = '7FCCD304802016BEBBCD342A332F91FF1F3BB5E902988B352697BE245F48E836'
//  const EPOCH = 1637848847
//  const XYM_ID = '3A8416DB2D53B6C8'
//  const NODE_URL = 'https://sym-test.opening-line.jp:3001'
//  const NET_TYPE = symbol.NetworkType.TEST_NET

//Main Net
const GENERATION_HASH = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6'
const EPOCH = 1615853185
const XYM_ID = '6BED913FA20223F8'
const NODE_URL = 'https://xym347.allnodes.me:3001'
const NET_TYPE = symbol.NetworkType.MAIN_NET

//---------------------------------------------

const repositoryFactory = new symbol.RepositoryFactoryHttp(NODE_URL)
const accountHttp = repositoryFactory.createAccountRepository()
const transactionHttp = repositoryFactory.createTransactionRepository()

setTimeout(() => {
  
const address = symbol.Address.createFromRawAddress(window.SSS.activeAddress)

const dom_addr = document.getElementById('wallet-addr')
dom_addr.innerText = address.plain()

accountHttp.getAccountInfo(address)
  .toPromise()
  .then((accountInfo) => {
    for (let m of accountInfo.mosaics) {
      if (m.id.id.toHex() === XYM_ID) {
        const dom_xym = document.getElementById('wallet-xym')
        dom_xym.innerText = `XYM Balance : ${m.amount.compact() / Math.pow(10, 6)}`
      }
    }
  })
const searchCriteria = {
  group: symbol.TransactionGroup.Confirmed,
  address,
  pageNumber: 1,
  pageSize: 20,
  order: symbol.Order.Desc,
}

transactionHttp
  .search(searchCriteria)
  .toPromise()
  .then((txs) => {
    console.log(txs)
    const dom_txInfo = document.getElementById('wallet-transactions')
    for (let tx of txs.data) {
      console.log(tx)
      const dom_tx = document.createElement('div')
      const dom_txType = document.createElement('div')
      const dom_hash = document.createElement('div')
      
//▼Transactionに表示されるとこ
      dom_txType.innerText = `Transaction Type : ${getTransactionType(tx.type)}`
      dom_txType.innerText = `Transaction Type : ${getTransactionType(tx.type)}`
      //dom_hash.innerHTML = "Transaction Hash : "+`${tx.transactionInfo.hash}`.link("https://symbol.fyi/transactions/"+ tx.transactionInfo.hash)　同じタブ
      dom_hash.innerHTML = "Transaction Hash : "+`<a href="https://symbol.fyi/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><small>${tx.transactionInfo.hash}</small></a>`
      
      
      dom_tx.appendChild(dom_txType)
      dom_tx.appendChild(dom_hash)
      dom_tx.appendChild(document.createElement('hr'))

      dom_txInfo.appendChild(dom_tx)
    }
  })
}, 500)

function getTransactionType (type) { // https://symbol.github.io/symbol-sdk-typescript-javascript/1.0.3/enums/TransactionType.html
  //もしくはこっち？　https://qiita.com/nem_takanobu/items/cf7c5e0fe5faa9221c29
  //ほんとはオブジェクトとか配列使うといいんだろうな…
  switch (type) {
  case  16724:
    return 'TRANSFER'
    break;//
  case  16720:
    return 'ACCOUNT_ADDRESS_RESTRICTION'
    break;//アカウント制限アドレストランザクションタイプ
  case  16716:
    return 'ACCOUNT_KEY_LINK'
    break;//リンクアカウントトランザクションタイプ
  case  16708:
    return 'ACCOUNT_METADATA'
    break;//アカウントメタデータトランザクション
  case  16976:
    return 'ACCOUNT_MOSAIC_RESTRICTION'
    break;//アカウント制限モザイクトランザクションタイプ
  case  17232:
    return 'ACCOUNT_OPERATION_RESTRICTION'
    break;//アカウント制限操作トランザクションタイプ
  case  16974:
    return 'ADDRESS_ALIAS'
    break;//アドレスエイリアストランザクションタイプ
  case  16961:
    return 'AGGREGATE_BONDED'
    break;//集約されたボンダートランザクションタイプ
  case  16705:
    return 'AGGREGATE_COMPLETE'
    break;//完全なトランザクションタイプを集約します。
  case  16712:
    return 'HASH_LOCK'
    break;//ロックトランザクションタイプ
  case  16977:
    return 'MOSAIC_ADDRESS_RESTRICTION'
    break;//モザイクアドレス制限タイプ
  case  17230:
    return 'MOSAIC_ALIAS'
    break;//モザイクエイリアストランザクションタイプ
  case  16717:
    return 'MOSAIC_DEFINITION'
    break;//モザイク定義トランザクションタイプ。
  case  16721:
    return 'MOSAIC_GLOBAL_RESTRICTION'
    break;//モザイクグローバル制限タイプ
  case  16964:
    return 'MOSAIC_METADATA'
    break;//モザイクメタデータトランザクション
  case  16973:
    return 'MOSAIC_SUPPLY_CHANGE'
    break;//モザイク供給変更トランザクション。
  case  16725:
    return 'MULTISIG_ACCOUNT_MODIFICATION'
    break;//Multisigアカウントトランザクションタイプを変更します。
  case  17220:
    return 'NAMESPACE_METADATA'
    break;//名前空間メタデータトランザクション
  case  16718:
    return 'NAMESPACE_REGISTRATION'
    break;//名前空間トランザクションタイプを登録します。
  case  16972:
    return 'NODE_KEY_LINK'
    break;//リンクノードキートランザクション
  case  16722:
    return 'SECRET_LOCK'
    break;//シークレットロックトランザクションタイプ
  case  16978:
    return 'SECRET_PROOF'
    break;//秘密の証明トランザクションタイプ
  case  16707:
    return 'VOTING_KEY_LINK'
    break;//リンク投票キートランザクション
  case  16963:
    return 'VRF_KEY_LINK'
    break;//VRFキートランザクションをリンクします
  default:
    return 'OTHER'
    break;
  }
}


function handleSSS() {
  console.log('handle sss')
  const addr = document.getElementById('form-addr').value
  const amount = document.getElementById('form-amount').value
  const message = document.getElementById('form-message').value
  
  const tx = symbol.TransferTransaction.create(
    symbol.Deadline.create(EPOCH),
    symbol.Address.createFromRawAddress(addr),
    [
      new symbol.Mosaic(
        new symbol.MosaicId(XYM_ID),
        symbol.UInt64.fromUint(Number(amount)*1000000)//1入力で1XYMになるように
      )
    ],
    symbol.PlainMessage.create(message),
    NET_TYPE,
    symbol.UInt64.fromUint(50000)//SSS最大手数料設定0.05XYM
  )

  window.SSS.setTransaction(tx)

  window.SSS.requestSign().then(signedTx => {
    console.log('signedTx', signedTx)
    transactionHttp.announce(signedTx)
  })
}


