
// import express from "express";
// import { App } from "octokit";
// import { createNodeMiddleware } from "@octokit/webhooks";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import crypto from 'crypto'
// import { analyzePR } from "./diffparser"
// import fs from "fs";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express(); 

// // Initialize GitHub App
// const githubApp = new App({
//   appId: process.env.APP_ID,
//   privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8"),
//   webhooks: { secret: process.env.WEBHOOK_SECRET },
// });

// // Initialize Gemini 1.5 Flash
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ 
//   model: "gemini-1.5-flash",
//   systemInstruction: `You are a Senior Staff Engineer and Security Researcher.
//   Analyze the provided git diff.
//   1. Identify bugs, security flaws, or performance issues.
//   2. For every issue, provide a concise explanation and a code fix using:
//      \`\`\`suggestion
//      [Your corrected code here]
//      \`\`\`
//   3. If no major issues are found, simply respond with 'LGTM!'.`
// });

// githubApp.webhooks.on(["pull_request.opened", "pull_request.synchronize"], async ({ octokit, payload }) => {
//   const owner = payload.repository.owner.login;
//   const repo = payload.repository.name;
//   const pull_number = payload.pull_request.number;

//   console.log(`Reviewing PR #${pull_number}...`);

//   try {
//     // Fetch the raw diff from GitHub
//     const { data: diff } = await octokit.rest.pulls.get({
//       owner, repo, pull_number,
//       mediaType: { format: "diff" },
//     });

//     // Gemini 1.5 Flash handles huge diffs easily in one shot
//     const result = await model.generateContent(`Review this PR diff:\n\n${diff}`);
//     const reviewText = result.response.text();

//     // Post the AI findings as a comment on the PR
//     await octokit.rest.issues.createComment({
//       owner, repo, issue_number: pull_number,
//       body: `##  Gemini AI Code Review\n\n${reviewText}`,
//     });

//     console.log(` Review posted for PR #${pull_number}`);
//   } catch (err) {
//     console.error("Error during review:", err);
//   }
// });

// // Start the server
// const port = process.env.PORT || 3000;
// const middleware = createNodeMiddleware(githubApp.webhooks, { path: "/webhook" });

// app.use(middleware).listen(port, () => {
//   console.log(` PR Reviewer online at http://localhost:${port}/webhook`);
// });


// // const port = process.env.PORT || 3000;

// // app.get('/webhook', (req, res) => {
// //   // console.log(">>>>>",req)
// //   res.send('Hello World')
// // }) 
// // app.listen(port, () => {
// //   console.log(` PR Reviewer online at http://localhost:${port}/webhook`);
// // });

// // const app = express()

// // app.get('/', (req, res) => {
// //   res.send('Hello World')
// // })

// // app.listen(3000, () => {
// //   console.log('Server is running on http://localhost:3000')
// // })



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
  // if (!(await webhooks.verify(body, signature))) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }
  // if (!signature) return false;
  // const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  // const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  // return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(`sha256=${digest}`));
};

app.post('/webhook', async (req, res) => {
  if (!verifySignature(req)) return res.status(401).send('Unauthorized');

  // console.log("listening from webhook",req,req.headers['x-hub-signature-256'])

  const { action, pull_request, repository } = req.body;
  if (action === 'opened' || action === 'synchronize') {
    console.log(`Reviewing PR #${pull_request.number}...`);
    analyzePR(pull_request, repository).catch(err => console.error("Analysis Failed:", err));
  }
  res.status(202).send('Accepted');

  // status test
  // res.status(200).send('sucess')
});

app.listen(process.env.PORT, () => console.log(`🛡️ Sentinel listening on ${process.env.PORT}`));






// import { Webhooks } from "@octokit/webhooks";

// const webhooks = new Webhooks({
//   secret: process.env.WEBHOOK_SECRET,
// });

// const handleWebhook = async (req, res) => {
//   const signature = req.headers["x-hub-signature-256"];
//   const body = await req.text();

//   if (!(await webhooks.verify(body, signature))) {
//     res.status(401).send("Unauthorized");
//     return;
//   }

//   // The rest of your logic here
// };