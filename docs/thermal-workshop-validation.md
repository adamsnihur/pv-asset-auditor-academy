# Thermography workshop · 2026-09-20

## Delivered scope

An independent open section at `#termowizja`, after the 3D laboratory and linked
from the hero. Eight topics provide 1,897 words of core explanation plus eight
exercises and solutions. Three synthetic fields demonstrate PV contrast,
reflection ambiguity and roof response. Three palettes and three scale modes
leave numerical samples unchanged. The UAV calculator exposes sampling and
translation during integration. Six mission stages, twelve glossary entries,
eight assessment questions and a static downloadable observation card complete
the workshop. No new dependencies, backend or learner storage are introduced.

## Validation evidence

- 69 automated tests passed, including ten new content/mathematics tests.
- Astro build and artifact validation passed: 86 files and 19 local references.
  Production-dependency audit reported zero vulnerabilities.
- Analytical calculator fixture: 30 m, 90° HFOV, 600 px gives 60 m coverage,
  10 cm/px and three pixels across a 30 cm target. At 5 m/s and 20 ms the
  displacement is one pixel. Doubling distance produces 20 cm/px and 0.5 px.
- Browser reproduced these numbers; empty input cleared using the keyboard and
  an invalid 180° HFOV hid results and exposed an explanation.
- Changing palette and scale retained the same numerical readings; narrow scale
  displayed an explicit clipping explanation. Both point markers are native
  keyboard-operable buttons. All three scenario answers showed expected feedback.
- Eight topic disclosures and their eight worked answers opened successfully.
- Quiz: all first choices scored 2/8; the answer key scored 8/8 with eight
  explanations. Changing an answer invalidates the displayed result.
- Mobile: 375 × 812 requested viewport, 360 CSS-pixel content area; document
  width equals scroll width. Viewer and calculator inspected visually. Temporary
  viewport override reset after testing.
- Local static observation-card URL returned the complete UTF-8 template.
  The initial Blob download was replaced by a native static download link,
  making the file accessible without JavaScript.
- No browser console errors during the tested interactions.
- Scoped OWASP injection check: typing an HTML/onerror payload through a numeric
  input created no HTML element or dialog; invalid input showed validation.
  The client renders dynamic prose through `textContent`, not HTML sinks.

The content is a study aid; it does not establish operator qualifications or
manufacturer-specific settings. Synthetic fields are not physical radiance
models, and interpolation on the canvas does not add detector data. The geometry
model assumes a flat plane, nadir view, square pixels and a rectilinear lens;
motion calculation excludes rotation, vibration and sensor response. No legal
flight clearance or universal inspection thresholds are derived from outputs.

## Thermal interpretation · Diarization Profile

**Sources:** fifteen primary references linked in `src/lib/thermal-content.mjs`,
retrieved 2026-09-19–20; manufacturers FLIR and DJI, IEA PVPS, the public IEC scope,
NREL's 2018 O&M publication, OSHA, EASA and PAŻP. Main review cross-checked the
measurement explanation, pixel/spot distinction, NUC, source formats, mapping
limitations, electrical hazards and the operational-information routes. OSHA
retrieval initially failed; its official indexed page confirmed the relevant
electrical-hazard material. No paywalled standard text was assumed available.
**Confidence:** high for the introductory principles; intentionally bounded for
specific equipment, field diagnostics and mission approval.

### Statements versus evidence

Camera displays invite users to treat color as diagnosis. Manufacturer material
separates radiometry, display scale and measurement geometry. The workshop makes
that distinction visible by changing only palette/scale while retaining A/B
values, then asks the learner for a defensible next verification step.

### Timeline

| Date | Event | Significance |
|---|---|---|
| 2026-09-19 | Workshop specification, content and simulation development | Separate conceptual learning from the existing gated course. |
| 2026-09-20 | Browser integration and numerical/security validation | Exercise feedback and calculated outputs checked in the actual UI. |

### Differences resolved

Manufacturer spot-size guidance depends on equipment and application; the
calculator therefore shows pixels without declaring universal sufficiency.
DJI describes limitations of particular stitched outputs; the text requires
validation of the processing pipeline instead of claiming all thermal mosaics
lose radiometry. IEC is cited for its public scope, not asserted compliance.
OSHA supports hazard awareness, not a claim that US rules govern Polish work.

### Structured judgment

The strongest introductory sequence is signal origin, acquisition controls,
spatial sampling, alternative explanations and traceable reporting. Linking
those stages avoids teaching image decoration as measurement competence.
The original numerical fixtures expose assumptions without inventing field
measurements or converting temperature contrast directly into power loss.

### Application

Retain original radiometric files, RGB context and capture conditions in future
real-case additions. Identify the actual camera, software version and method
before adding operational presets. Replace synthetic cases only with properly
authorized source datasets and a documented independent verification.
