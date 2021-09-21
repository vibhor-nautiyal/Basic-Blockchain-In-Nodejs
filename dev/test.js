const Blockchain=require("./blockchain");

const bitcoin=new Blockchain();

const previousBlockHash="orqoreniernvrequhvng";

const currentBlockData=[
    {
        amount:101,
        sender:"jn5itng84nri4nfnf",
        recipient:"8tnij3n3irnin44"
    },
    {
        amount:200,
        sender:"rngoqrejorm",
        recipient:"lwekmklkrmgr"
    },
    {
        amount:5000,
        sender:"wkmroijmoiv",
        recipient:"wrkngriunqgoip"
    }
];

console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));