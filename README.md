1. Executive Summary
The AI PR Reviewer is an automated internal tool designed to streamline the code review process by analyzing GitHub Pull Requests. By leveraging Large Language Models (LLMs), the system identifies security vulnerabilities, performance bottlenecks, and adherence to company coding standards before human reviewers intervene.
2. Technical Architecture
The system is built on a decoupled architecture to ensure scalability across the company’s repository portfolio.
• Webhook Listener (Node.js): Acts as the entry point, receiving real-time events from GitHub via the Octokit SDK.
• LLM Engine (Gemini 1.5 Flash): Processes raw code diffs using custom system instructions to provide context-aware feedback.
• Data Layer (MongoDB): Stores repository-specific configurations (e.g., "Strict Mode") and maintains a permanent audit trail of all reviews.
• Control Dashboard (React): An internal UI for developers to toggle review rules and audit AI performance.
3. Core Features & Functionality
Feature
Description
Automated Diff Analysis - Automatically fetches raw PR diffs and generates feedback within seconds.
Customizable Rules - Toggles for Strict Mode (pedantic logic checks) and Ignore Styling (ignoring linter/CSS noise).
Review History - A comprehensive log of past reviews to track code quality trends over time.
Security Guardrails - Specific prompts designed to detect hardcoded secrets and common OWASP vulnerabilities.
4. Implementation Milestones
• Phase 1: GitHub App registration and webhook connectivity using ngrok.
• Phase 2: Integration with Gemini 1.5 Flash for automated commenting.
• Phase 3: Development of the React dashboard and MongoDB persistence layer.
• Phase 4: Implementation of the "Strict Mode" and "Styling" toggle logic.
5. Business Value & ROI
• Reduced Review Time: Initial findings suggest a reduction in manual "nitpick" comments by 40%, allowing senior engineers to focus on high-level architecture.
• Consistency: Ensures that every PR, regardless of the team, meets a baseline standard for security and performance.
• Knowledge Transfer: The AI provides educational feedback to junior developers, acting as a real-time coding coach.
6. Future Roadmap
• Auto-Fix Suggestions: Implementing the ability for the AI to create "Suggested Changes" directly in GitHub.
• Slack Integration: Real-time notifications for critical security alerts found during reviews.
• Performance Analytics: Detailed reporting on common coding errors across different teams to inform future training.
7. Conclusion
The AI PR Reviewer is an initiative to integrate AI into the SDLC. It provides a scalable, consistent, and secure methodology for maintaining code quality across all internal projects.
