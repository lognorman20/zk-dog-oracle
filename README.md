# ZK Dog Picture Oracle & API

This project focuses on verifying dog images from an API have not been tampered with using zero knowledge proofs.

## Running the Oracle

All oracle code can be found under the `dog-api` directory. 

To launch the oracle server locally, run the following command:
```
node dog-api/index.js
```
Then, go to your web browser and type in the link `http://localhost:3000/dog/random/[INSERT RANDOM NUMBER HERE]` to get a random dog picture that is signed using Mina's cryptographic functions. For instance, after running the above command, go to the following link on your browser: `http://localhost:3000/dog/random/8`.

This project is also fully deployed on the web. To run this oracle live on the web, go to `https://shark-app-b55zg.ondigitalocean.app/dog/random/[INSERT RANDOM NUMBER HERE]` to get a random dog picture.

## Using the oracle from a zkApp

The demo code of how to use this oracle can be found in the `dog-zk-app` directory. Namely, the main code to run the zkApp can be found in the `dog-zk-app/src/main.ts` file. The smart contracts for this app can be found in the same directory named `DogPicOracle.ts`. 

A demo of the app can be examined by running the following commands while at the `dog-zk-app` directory:
```
npm run build && node build/src/main.js
```
