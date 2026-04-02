/**
 * Splits a large git diff into manageable chunks per file
 * and filters out noise like lockfiles.
 */
// export function chunkDiff(diff) {
//   const files = diff.split(/^diff --git /m).filter(Boolean);
//   const excludedFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

//   return files.filter(file => {
//     return !excludedFiles.some(excluded => file.includes(excluded));
//   });
// }

const { Octokit } = require("@octokit/rest");
const axios = require('axios');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function analyzePR(pr, repo) {
  // 1. Fetch the diff (saves tokens vs fetching full files)
  console.log("//analyzer",pr)
  const { data: diff } = await octokit.rest.pulls.get({
    owner: repo.owner.login,
    repo: repo.name,
    pull_number: pr.number,
    mediaType: { format: "diff" },
  });
  console.log("//analyzer",diff)

  // // 2. LLM Prompt Engineering
  // const prompt = `Review this PR diff. Identify bugs, security flaws, or performance issues.
  // If an issue is found, provide a "Suggested Change" using this format:
  
  // ### ⚠️ [Issue Name]
  // **Description**: [Why it matters]
  // **Fix**:
  // \`\`\`suggestion
  // [Corrected Code]
  // \`\`\`
  
  // DIFF:
  // ${diff.substring(0, 8000)}`; // Simple truncation to avoid token limits

  // // 3. Request AI Review
  // const aiResponse = await axios.post(process.env.LLM_ENDPOINT, {
  //   model: "gpt-4o", // or your preferred model
  //   messages: [{ role: "system", content: prompt }]
  // }, {
  //   headers: { 'Authorization': `Bearer ${process.env.LLM_KEY}` }
  // });

  // // 4. Post comment to GitHub
  // await octokit.rest.issues.createComment({
  //   owner: repo.owner.login,
  //   repo: repo.name,
  //   issue_number: pr.number,
  //   body: `## AI Sentinel Review\n\n${aiResponse.data.choices[0].message.content}`
  // });
}

module.exports = { analyzePR };