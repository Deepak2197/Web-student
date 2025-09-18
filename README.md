# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh





Deployment Workflow Guidelines 
This document defines the standard workflow for pushing code changes through various environments—
Development, QA, Staging, and Production. It ensures code quality, traceability, and smooth transitions. 
 
1. Development Environment 
• Developers must create a feature or bugfix branch from the base (dev or main) branch. 
• After development: 
o Test the code thoroughly in your local or development environment. 
o Push your changes to the dev branch (never directly to qa, stage, or prod). 
o Ensure basic validations (unit tests, linter checks) are passing. 
   Goal: Code is verified and functional in the dev environment. 
 
2. QA Environment 
• Once development is stable, raise a Merge Request (MR) to merge into the qa branch. 
• Inform the QA team after the merge. 
• QA team conducts: 
o Functionality Testing 
o Regression Testing 
• Issues found are to be logged and communicated to the developer. 
   Goal: Code is verified for correctness and regressions. 
 
3. Staging Environment 
• After QA sign-off, raise a Merge Request to the stage branch. 
• Notify the QA Team Lead or QA Head for final validation. 
• Include the following in your email or MR comment: 
o Feature Summary 
o Test Coverage 
o Reason for pushing to staging 
o Known issues (if any) 
          Note: Approval from the QA lead is mandatory before moving to production. 
   Goal: Comprehensive validation in a production-like environment. 
 
4. Production Environment 
• After staging approval, raise a final MR to the prod branch. 
• Ensure: 
o No critical issues are pending. 
o All stakeholders (PM, QA, Dev) are informed. 
• Perform a final smoke test after deployment to production. 
• Monitor logs and system performance post-deployment. 
Goal: Safe, monitored, and smooth release to production. 

Branching & Cleanup Guidelines 
•     Do NOT commit directly to qa, stage, or prod. 
•    Always create: 
o feature/<name> for new features 
o bugfix/<name> for bug fixes 
•       After merging and verification: 
o Delete the branch to keep the repository clean. 
o Tag the release if applicable. 
Communication Checklist 
Before promoting code to staging or production, include the following in the email or MR comment: 
• Feature or bug description 
• Environment to deploy (staging or production) 
• Test results summary 
• Any dependencies or related merges 
• Contact person in case of issues
