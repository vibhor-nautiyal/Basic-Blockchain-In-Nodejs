const express=require("express");
const bodyParser=require("body-parser");
const Blockchain=require("./blockchain");
const rp=require("request-promise");

const portNo=process.argv[2];

const {v4:uuid}=require("uuid");

const nodeAddress=uuid().split('-').join('');

const bitcoin=new Blockchain();

app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/blockchain",function(req,res){
    res.send(bitcoin);
});


app.post("/transaction",function(req,res){
    
    const newTransaction=req.body;
    const blockIdx=bitcoin.addTransactionToPendingTransactions(newTransaction);

    res.json(
        {
            "note":"Transaction will be added in block number "+blockIdx
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
   
   
    // bitcoin.createNewTransaction(6.25,"00",nodeAddress);

    const newBlock=bitcoin.createNewBlock(nonce,previousBlockHash,currentBlockHash);
    
    addBlockRequests=[];

    bitcoin.networkNodes.forEach(networkNode=>{

        reqOptions={
            method:"POST",
            uri:networkNode+"/receive-block",
            body:newBlock,
            json:true
        };

        addBlockRequests.push(rp(reqOptions));

    });

    Promise.all(addBlockRequests)
    .then(data=>{
        const reqOptions={
            uri: bitcoin.currentNodeUrl+"/transaction-broadcast",
            method:"POST",
            body:{
                amount: 6.25,
                sender: "00",
                recipient: nodeAddress
            },
            json:true
        };
        return rp(reqOptions);
    })
    .then(data=>{
        res.json({
            "note":"New block mined successfully",
            "block": newBlock
        });
    });
});


app.post("/receive-block",function(req,res){
    const newBlock=req.body;
    const lastBlock=bitcoin.getLastBlock();
    const legalHash=(lastBlock.hash==newBlock.previousBlockHash);
    const legalIndex=lastBlock.index+1==newBlock.index;
    if(legalHash && legalIndex){

        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions=[];
        res.json(
            {
                note:"New block received",
                newBlock:newBlock
            }
        );
    }
    res.json(
        {
            note:"New block rejected",
            newBlock:newBlock
        }
    );
});

app.post("/register-and-broadcast-node",function(req,res){

    //this API registers a new node in any one of the pre existing node's networkNodes array, 
    //which further registers this node to all other nodes in its own network
    //and then finally all the pre-existing nodes are registered in the new node too

    const newNodeUrl= req.body.newNodeUrl;  //sent with request body

    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1 && newNodeUrl!=bitcoin.currentNodeUrl)
        bitcoin.networkNodes.push(newNodeUrl);

    const reqPromises=[];
    //broadcast step
    bitcoin.networkNodes.forEach(nodeUrl=>{
        
        const requestOptions={
            method: "POST",
            uri: nodeUrl+"/register-node",
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        };

        reqPromises.push(rp(requestOptions));

    });

    Promise.all(reqPromises)
    .then(data=>{
        //now registering of new node on the network is done and now we need to register all pre-existing nodes inside the new node using register-node-bulk API

        const bulkReqOptions={
            method: "POST",
            uri: newNodeUrl+"/register-node-bulk",
            body:{
                allNetworkNodes:[...bitcoin.networkNodes,bitcoin.currentNodeUrl]
            },
            json:true
        };

        return rp(bulkReqOptions);
    })
    .then(data=>{
        // return from bulk request promise
        res.json({note: "New node registered with network successfully"});
    });
    
});

app.post("/register-node",function(req,res){

    //called from register-and-broadcast-node api

    const newNodeUrl=req.body.newNodeUrl;

    if(bitcoin.networkNodes.indexOf(newNodeUrl)==-1 && newNodeUrl!=bitcoin.currentNodeUrl) 
        bitcoin.networkNodes.push(newNodeUrl);

    res.json({note: "New node registered successfully in "+bitcoin.currentNodeUrl});

});

app.post("/register-node-bulk",function(req,res){

    //registers all pre existing nodes in the newly created node

    const allNodes=req.body.allNetworkNodes;

    allNodes.forEach(networkNodeUrl=>{
        
        if(bitcoin.networkNodes.indexOf(networkNodeUrl)==-1 && networkNodeUrl!=bitcoin.currentNodeUrl)
            bitcoin.networkNodes.push(networkNodeUrl);
    
    });

    res.json({note:"All pre-existing nodes registered in the new node"});

});

app.post("/transaction-broadcast",function(req,res){

    const newTransaction=bitcoin.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    broadcastRequests=[];

    bitcoin.networkNodes.forEach(nodeUrl=>{

        const reqOptions={
            method:"POST",
            uri:nodeUrl+"/transaction",
            body: newTransaction,
            json:true
        };

        broadcastRequests.push(rp(reqOptions));

    });


    Promise.all(broadcastRequests)
    .then(data=>{
        res.json({note:"Broadcast was successful"});
    });

});


app.listen(portNo,function(){
    console.log("Listening at port "+portNo);
});