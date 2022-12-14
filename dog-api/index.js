const Koa = require("koa");
const Router = require("@koa/router");
const { isReady, PrivateKey, Field, Signature, UInt64, CircuitString } = require("snarkyjs");

const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

async function getDogPic(dogId) {
  // We need to wait for SnarkyJS to finish loading before we can do anything
  await isReady;

  /* TODO: create env variable for private key of api */
  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
      "EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53"
  );

  // We compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();

  // TODO: Get data from dog api
  const dogPayload = await fetch (
    "https://dog.ceo/api/breeds/image/random"
  );

  const payload = await dogPayload.json();
  const link = payload.message;

  // sign the image payload
  const circuitAddr = CircuitString.fromString(link);
  const imgAddr = circuitAddr.hash();

  const id = Field(dogId);  
  const signature = Signature.create(privateKey, [id, imgAddr]);  

  return {
    data: { id: id, imgAddr: imgAddr },
    signature: signature,
    publicKey: publicKey,
  };
}

router.get("/dog/random/:id", async (ctx) => {
  ctx.body = await getDogPic(ctx.params.id);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT);
