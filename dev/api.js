const express=require("express");
const bodyParser=require("body-parser");
const Blockchain=require("./blockchain");
const {v4:uuid}=require("uuid");

const nodeAddress=uuid().split('-').join('');

const bitcoin=new Blockchain();

app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/blockchain",function(req,res){
    res.send(bitcoin);
});


app.post("/transactions",function(req,res){
    
    const blockIndex=bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient);
    res.json(
        {
            "note":"Transaction will be added in block number "+blockIndex
        }
    );

});


app.get("/mine",function(req,res){

    const lastBlock=bitcoin.getLastBlock();
    const previousBlockHash=lastBlock.hash;
    const currentBlockData={
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index']+1
    };
    const nonce=bitcoin.proofOfWork(previousBlockHash,currentBlockData);
    const currentBlockHash=bitcoin.hashblock(previousBlockHash,currentBlockData,nonce);
    
    //Mining Done.
    //Now the miner node has to be awarded
    //Let rewarding address = 00
    //The address of the miner (this particular node in our local system) is created by uuid
    bitcoin.createNewTransaction(6.25,"00",nodeAddress);

    const newBlock=bitcoin.createNewBlock(nonce,previousBlockHash,currentBlockHash);
    

    res.json({
        "note":"New block mined successfully",
        "block": newBlock
    });
});


app.listen(3000,function(){
    console.log("Listening at port 3000");
});