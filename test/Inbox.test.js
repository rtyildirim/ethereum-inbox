const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
const initialMessage = "Hi there";

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [initialMessage] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    //console.log(inbox);
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();

    assert.equal(initialMessage, message);
  });

  it("can change the message", async () => {
    const mockMessage = "mock message";
    const res = await inbox.methods.setMessage(mockMessage).send({
      from: accounts[0],
    });
    console.log(res.transactionHash);
    const message = await inbox.methods.message().call();

    assert.equal(mockMessage, message);
  });
});
