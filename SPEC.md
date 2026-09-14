# PV Asset Auditor Academy Technical Specification

## Root Problem

The e-learning platform was implemented inside an unrelated service website and
published from a repository carrying that service brand. The public artifact
also contains unrelated website pages and assets. The course is an independent
learning product and must not imply a relationship with an operator brand,
service website, or commercial offer.

## Empirical Evidence

- The current page imports a layout from an unrelated service website.
- The course title and kicker contain that website's commercial brand.
- The existing GitHub repository carries the same unrelated brand.
- Its published tree contains the complete service website build, not only the
  learning platform.

## Alternative Framings

1. Rename only the repository. Rejected because the source and build would
   remain coupled to the unrelated service site.
2. Keep the course as a service-website route but hide it from navigation. Rejected
   because technical and brand coupling would remain.
3. Create a standalone source project, neutralize branding, publish it from its
   own repository, and retire the incorrect deployment. Selected.

## Inputs & Outputs

Inputs:

- the complete PV Asset Auditor course Markdown;
- the existing course engine, quizzes, laboratory, styles, and course visuals;
- the user's GitHub account and GitHub Pages.

Outputs:

- a standalone Astro project in this directory;
- a public `adamsnihur/pv-asset-auditor-academy` repository;
- a GitHub Pages site at the repository root path;
- no Academy code remaining in the unrelated website working tree;
- the obsolete, incorrectly labelled Pages deployment disabled and archived.

## Data Model and Structures

- `courseStages`: ordered learning stages with prerequisites and declared hours.
- `quizzes`: five-question stage assessments with explicit answer keys.
- `systemModes`: interactive microinstallation and utility-scale PV models.
- browser state: current stage, completed stages, scores, and theme under a
  product-neutral local-storage key.

## Test Assertions and Validation

- all existing course, renderer, quiz, progression, and laboratory tests pass;
- tests reject external-service branding and service-specific storage keys;
- the production build contains only the course application;
- built links and asset paths resolve under the GitHub Pages base path;
- a browser smoke test confirms the hero, laboratory, progress, quiz feedback,
  responsive layout, and absence of unexpected console errors;
- GitHub repository and Pages API identify the independent project;
- the public root URL returns HTTP 200.

## Deployment Contract

The `main` branch stores source code. GitHub Actions builds the static Astro
site and deploys the `dist` artifact through GitHub Pages. The workflow uses
least-privilege Pages permissions and no repository secrets.

## User Approval: APPROVED

The user explicitly requested GitHub publication and objected to any connection
between the learning platform and an unrelated service website. This
specification implements that correction.
