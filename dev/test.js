const Blockchain=require("./blockchain");

const bitcoin=new Blockchain();

const testObj={
    "chain": [
      {
        "index": 1,
        "timestamp": 1632333560637,
        "transactions": [],
        "nonce": 0,
        "hash": 0,
        "previousBlockHash": null
      },
      {
        "index": 2,
        "timestamp": 1632333593623,
        "transactions": [],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": 0
      },
      {
        "index": 3,
        "timestamp": 1632333758426,
        "transactions": [
          {
            "amount": 6.25,
            "sender": "00",
            "recipient": "f442b227aec648c7ac71e32832ac577c",
            "txnId": "a3649d9cb36e42118933eeb36f9b2c5d"
          }
        ],
        "nonce": 5585,
        "hash": "0000083f6c094f743e790fee92d955bb2b21e1232e99a7c52dca8fc8ba2c5d76",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
      },
      {
        "index": 4,
        "timestamp": 1632333880242,
        "transactions": [
          {
            "amount": 6.25,
            "sender": "00",
            "recipient": "6b3128b004e84070a2cbaa5e36884f2f",
            "txnId": "acf19b5dc5824fafa372a9f14a556557"
          }
        ],
        "nonce": 71077,
        "hash": "000084b8f91e47d8f070b2a61ca8b6d3b3427c679803f0e7d0779603ca5e2f2f",
        "previousBlockHash": "0000083f6c094f743e790fee92d955bb2b21e1232e99a7c52dca8fc8ba2c5d76"
      },
      {
        "index": 5,
        "timestamp": 1632334303448,
        "transactions": [
          {
            "amount": 6.25,
            "sender": "00",
            "recipient": "6b3128b004e84070a2cbaa5e36884f2f",
            "txnId": "e0333871a999400487d3f68b708e1430"
          },
          {
            "amount": 150,
            "sender": "ljhb;uigfhjvuyfuhuuitulkj",
            "recipient": "jhvhdkhggklojliopjoihjhjf",
            "txnId": "786a0497403246f2a99e8a3219798a93"
          }
        ],
        "nonce": 25192,
        "hash": "00008a06e411f8758b1dfef7b5144ef0ffc22962348ef9aca0bf536cf3ece341",
        "previousBlockHash": "000084b8f91e47d8f070b2a61ca8b6d3b3427c679803f0e7d0779603ca5e2f2f"
      }
    ],
    "pendingTransactions": [
      {
        "amount": 6.25,
        "sender": "00",
        "recipient": "a1b1d6f322da4dcbb4ff687eb39dd159",
        "txnId": "9ce13037ca7d4daba4a3e3c69eb17b42"
      }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:3005"
    ]
  };

  console.log(bitcoin.chainIsValid(testObj.chain));