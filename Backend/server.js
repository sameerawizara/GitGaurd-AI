require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { analyzePR } = require('./diffparser');
const { Webhooks } =require('@octokit/webhooks');

const app = express();
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET,
});

const verifySignature = async(req) => {
  const signature = req.headers['x-hub-signature-256'];
  const body = await req.toString();

  return await webhooks.verify(body, signature);
 
};

app.post('/webhook', async (req, res) => {
  if (!verifySignature(req)) return res.status(401).send('Unauthorized');

  // console.log("listening from webhook",req,req.headers['x-hub-signature-256'])

  const { action, pull_request, repository } = req.body;
  if (action === 'opened' || action === 'synchronize') {
    console.log(`Reviewing PR #${pull_request.number}...`);
    analyzePR(pull_request, repository).catch(err => console.error("Analysis Failed:", err));
  }
  res.status(200).send('Accepted');

  // status test
  // res.status(200).send('sucess')
});

app.listen(process.env.PORT, () => console.log(`Sentinel listening on ${process.env.PORT}`));



