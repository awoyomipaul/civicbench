# CivicBench

Need-first civic projects, reviewed contributions and shareable records.

## Source and build

The connected Pages deployment runs npm run build. civicbench-source.json contains the complete editable source files and licensed image assets. civicbench-release.mjs reconstructs them with their original paths before building the frontend and Pages Functions. This supports deployment through the signed-in GitHub browser without terminal credentials.

Run npm run unpack to expand the source, then edit web/, core/, functions/, migrations/ and tests/. Regenerate civicbench-source.json from the edited files before committing. npm test expands and builds the source, then runs the workflow and privacy checks (Node 24 for built-in SQLite tests). The production build uses Node 20 or newer and no build dependencies.

## Runtime

Bind CB_DB to the new civicbench-platform D1 database. Schema creation is additive and automatic on the first API call. Existing identity accounts remain in the original civicbench-api Worker. Sign-in tokens are held in HttpOnly, Secure cookies. Administrator roles are granted to exact account IDs in cb_roles, never to an email claimed during registration.

Optional CB_EVIDENCE is a private R2 bucket. Without it, private evidence uses the platform database, with a 512 KB limit per file. No pooled money is collected; funding and payment entries record agreed external arrangements.

## Access and sharing

Individuals and organisations may propose needs. Proposals stay private during review. Contributions require agreed terms, proof, independent review and the acceptance window. CVs and period recaps include verified records, allow selected sharing, and reflect credential corrections or withdrawal. Organisation recap contributions require contributor consent and public verification.

The original React UI is retired and not included in the deployed assets. Both canonical Word masters remain unchanged. Pilot gates remain evidence decisions; deployment does not declare them passed.
