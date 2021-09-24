const sha256=require("sha256");
const {v4:uuid}=require("uuid");
const currentNodeUrl=process.argv[3];

function Blockchain(){
    this.chain=[];
    this.pendingTransactions=[];
    this.createNewBlock(0,null,0);
    this.currentNodeUrl=currentNodeUrl;

    this.networkNodes=[];

}

Blockchain.prototype.createNewBlock=function(nonce,previousBlockHash,hash){

    const newBlock={

        index: this.chain.length+1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce:nonce,
        hash:hash,
        previousBlockHash:previousBlockHash
    };
    this.chain.push(newBlock);
    this.pendingTransactions=[];
    return newBlock;
}

Blockchain.prototype.getLastBlock=function(){

    return this.chain[this.chain.length-1];
}

Blockchain.prototype.createNewTransaction=function(amount,sender,recipient){

    const newTransaction={
        amount:amount,
        sender:sender,
        recipient:recipient,
        txnId:uuid().split('-').join('')
    }

    return newTransaction;

}

Blockchain.prototype.addTransactionToPendingTransactions=function(transaction){

    this.pendingTransactions.push(transaction);
    return this.getLastBlock['index']+1;
}


Blockchain.prototype.hashblock=function(previousBlockHash,currentBlockData,nonce){

    const dataAsString=previousBlockHash+nonce.toString()+JSON.stringify(currentBlockData);
    const hash=sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork=function(previousBlockHash,currentBlockData){

    let nonce=0;
    let hash=this.hashblock(previousBlockHash,currentBlockData,nonce);

    while(!hash.startsWith("0000")){
        nonce++;
        hash=this.hashblock(previousBlockHash,currentBlockData,nonce);
    }
    return nonce;
}

Blockchain.prototype.chainIsValid=function(blockchain){

    const genesisBlock=blockchain[0];
    if(genesisBlock.nonce!=0 || genesisBlock.hash!="0" || genesisBlock.previousBlock!=null || genesisBlock.transactions.length!=0)
        return false;

    for(var i=1;i<blockchain.length;i++){

        const currentBlock=blockchain[i];
        const previousBlock=blockchain[i-1];
        const blockHash=this.hashblock(previousBlock.hash, {transactions:currentBlock.transactions , index:currentBlock.index},currentBlock.nonce );
        if(currentBlock.previousBlockHash!=previousBlock.hash || !blockHash.startsWith("0000"))
            return false;
    }
    return true;
}

Blockchain.prototype.getBlock=function(blockHash){

    for( var block of this.chain){
        if(block.hash===blockHash){
            console.log(block);
            return block;
        
        }
    }

    return null;
}

Blockchain.prototype.getTransaction=function(txnId){

    for( var block of this.chain){
        
        for(var txn of block.transactions){
            
            if(txn.txnId===txnId){
                return {
                    txn: txn,
                    block:block
                };
            
            }
        }
        
    }

    return {
        txn: null,
        block:null
    };
;
}

Blockchain.prototype.getAddressData=function(address){

    const addressTransactions=[];

    this.chain.forEach(block=>{
        block.transactions.forEach(transaction=>{
            if(transaction.sender===address || transaction.recipient===address){
                addressTransactions.push(transaction);
            }
        });
    });

    let balance=0;

    addressTransactions.forEach(transaction=>{
        if(transaction.recipient===address)
            balance+=transaction.amount;
        else balance-=transaction.amount;
    });


    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    }; 
}


module.exports=Blockchain;