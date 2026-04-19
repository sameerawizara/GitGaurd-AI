const { Octokit } = require("@octokit/rest");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const axios = require("axios");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

function cleanDiff(rawDiff) {
  return rawDiff
    .split("\n")
    .filter((line) => {
      // Keep file markers, chunk headers, and added lines
      return (
        line.startsWith("+++ b/") ||
        line.startsWith("@@") ||
        line.startsWith("+")
      );
    })
    .map((line) => {
      // Make file names more readable for the LLM
      if (line.startsWith("+++ b/")) return `\nFile: ${line.slice(6)}`;
      return line;
    })
    .join("\n");
}

async function analyzePR(pr, repo) {
  // 1. Fetch the diff (saves tokens vs fetching full files)
  console.log("//analyzer", pr);
  const { data: diff } = await octokit.rest.pulls.get({
    owner: repo.owner.login,
    repo: repo.name,
    pull_number: pr.number,
    mediaType: { format: "diff" },
  });

  try {
    const preppedDiff = cleanDiff(diff);
    console.log("//Clean diff", preppedDiff);
    const prompt = `
      You are an expert Senior Software Engineer and Security Researcher.
      Review the following git diff. Find bugs, logic errors, or security flaws 
      specifically in the added code (lines starting with +).
      
      DIFF CONTENT:
      ${preppedDiff}
    `;
    // res.status(200).send('Success Response');
    const schema = {
      description: "List of issues",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          recipeName: {
            type: SchemaType.STRING,
            description: "Name of suggesstions",
            nullable: false,
          },
        },
        required: ["suggestName"],
      },
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
      // generationConfig: {
      //   responseMimeType: "application/json",
      //   responseSchema: schema,
      // },
    });

    console.log("Analyzing with Gemini...");
    const result = await model.generateContent(prompt);

    const response = await result.response.text();
    console.log("Response from Gemini", response);

    if (response) {
      try {
        await octokit.rest.pulls.createReview({
          owner: repo.owner.login,
          repo: repo.name,
          pull_number: pr.number ,
          body: response, // The structured Markdown from the LLM
          event: "COMMENT", // Options: APPROVE, REQUEST_CHANGES, COMMENT
        });
        console.log(" Feedback loop complete: Comment posted.");
      } catch (error) {
        console.error(`Error posting to GitHub: ${error.message}`);
      }
    }

    // return response.toString();
  } catch (error) {
    return `Error calling Gemini: ${error.message}`;
  }
}

module.exports = { analyzePR };

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
//   model: "gemini-3-flash-preview", // or your preferred model
//   messages: [{ role: "system", content: prompt }]
// }, {
//   headers: { 'Authorization': `Bearer ${process.env.LLM_KEY}` }
// });

// console.log("AI response",aiResponse)

// // 4. Post comment to GitHub
// await octokit.rest.issues.createComment({
//   owner: repo.owner.login,
//   repo: repo.name,
//   issue_number: pr.number,
//   body: `## AI Sentinel Review\n\n${aiResponse.data.choices[0].message.content}`
// });
