# PV Asset Auditor Academy Technical Specification

## Thermography workshop, 2026-09-19

Add a standalone thermography and UAV thermography section after the 3D lab, linked from the hero. Provide eight readable topics, source references, exercises with explanations, a synthetic thermal viewer demonstrating palette/scale versus unchanged data, a nadir flight geometry calculator, a mission evidence workflow and knowledge checks. Explain emissivity, reflections, atmosphere, spatial resolution versus NETD/accuracy, radiometric originals, PV/electrical/building limitations and UAV-specific acquisition. All simulated values must be labelled and separated from manufacturer specifications or field findings. No universal diagnostic or flight thresholds. Preserve existing 18-lesson progression and local notes. New controls use native form elements and work on mobile. Validate math against analytic fixtures, teaching data references, invalid inputs, browser interactions, injection handling and Pages artifact; publish under the standing Pages authorization.

## Equipment anatomy expansion, 2026-09-19

Add a detailed 3D anatomy view alongside the existing installation view. Cover AC/nN switchboards, MV switchgear, transformer, inverter, DC protection/combiner and metering. Each device exposes selectable internal parts, a cutaway and exploded arrangement, a narrated energy/protection path, a worked example and source links. Distinguish conceptual models from equipment-specific wiring and procedures. Selection must work through native buttons as well as raycasting; the complete explanation must remain available without WebGL. Preserve the course and existing overview. Validate all parts against renderable geometry, transitions, responsive layout, disposal and the built artifact.

## Guided curriculum upgrade, 2026-09-16

User-authorized scope: improve domain substance and learner experience from zero electrical knowledge through PV, UAV inspection and mapping. Keep the independent product identity and existing advanced reference. Add 18 discrete lessons across electrical/PV, field/thermal, and mapping/GIS tracks, backed by primary sources, worked examples, learner artifacts and explanatory assessment feedback. Use existing Astro dependencies and theme.

Completion of self-study is not electrical, UAV or surveying qualification. Critical quiz items must all be correct; ordinary quiz threshold is 80%. An artifact and explicit self-review are also required, labelled as self-review rather than professional assessment. Persist locally and resume by lesson. Remove unsupported 220-hour and expert-readiness promises from the delivery surface; evidence the new path in course-plan.json. Verify content/depth, state/quiz logic, production build, browser accessibility and input-injection behavior. No deployment is part of this request.

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
