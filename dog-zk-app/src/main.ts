import { DogPicOracle } from "./DogPicOracle.js";

import {
  isReady,
  shutdown,
  Field,
  Mina,
  Signature,
  CircuitString,
  AccountUpdate,
  PrivateKey,
} from 'snarkyjs';

const ORALCE_PUBLIC_KEY = "B62qmyMkj9p99wTTVSsnvmDRzkwqotWpzoaJHmVX5K8Bbqn8733iDNz";

(async function main() {
  /* 2k generic setup */
  await isReady;

  console.log('Setting up envorinment...');
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const deployerAccount = Local.testAccounts[0].privateKey;

  const zkAppPrivateKey = PrivateKey.random();
  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
  const zkAppInstance = new DogPicOracle(zkAppPublicKey);
  DogPicOracle.compile();

  const initTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    zkAppInstance.init(zkAppPrivateKey);
  });
  await initTxn.prove();
  initTxn.sign([zkAppPrivateKey]);
  await initTxn.send();

  /* running it fr */
  console.log('Environment set up, getting your picture...');
  const id = Field(Math.floor(Math.random() * 1000));
  const payload = await fetch (
    "https://shark-app-b55zg.ondigitalocean.app/dog/random/" + id.toString()
  );

  /* get the image from the api */
  const data = await payload.json();

  const payloadLink = data.data.imgAddr;
  const link = CircuitString.fromString(payloadLink);

  /* verify the transaction */
  console.log('Verifying your picture is the same as the one from the api...');
  const signature = Signature.fromJSON(data.signature);
  const txn = await Mina.transaction(deployerAccount, () => {
    zkAppInstance.verify(
      id, link, signature
    );
  });
  await txn.prove();
  await txn.send();

  const events = await zkAppInstance.fetchEvents();
  const verifiedEventValue = events[0].event.toFields(null)[0];
  verifiedEventValue.assertEquals(id);

  console.log('Successfully verified the image! Your picture can be found @ [' + payloadLink + ']. Enjoy your picture :]');
  await shutdown();
})();
