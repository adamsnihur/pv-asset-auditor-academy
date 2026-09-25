# PV thermography standards · verification 2026-09-25

## Structured research profile

**Sources:** IEC publication record and specification (2017), PKN catalogues
(2016–2020), PKN guidance, IEA PVPS O&M guidance (2022), FLIR technical guidance,
and the DPS catalogue of the edition 2 project (checked 2026-09-25).
**Confidence:** high for the cited edition and selected technical criteria;
limited for absence of a Polish adoption, which is explicitly unconfirmed.

### Claimed designation versus verified record

The requested “PN-EN IEC 62446-3” designation was not confirmed. The IEC catalogue
identifies **IEC TS 62446-3:2017**, edition 1, as a Technical Specification.
The course uses that exact designation. PKN confirms Polish parts 1 and 2;
they cover complementary activities, not a replacement thermography method.

### Timeline

| Date | Evidence | Teaching implication |
|---|---|---|
| 2017-06-15 | IEC TS 62446-3 edition 1 published | Record the exact edition in the inspection scope. |
| 2019-01 | PKN amendment A1 to part 1 | Cite the amendment with the base document. |
| 2020-12 | Polish part 2 | Connect findings to maintenance planning. |
| 2026-05-15 | DPS project listing: edition 2 stage 40.99 | A development project is not a published replacement. |

### Contradictions and limits

- “Stability date 2026” is not an automatic expiry date.
- No Polish part 3 was confirmed in indexed catalogue searches. Direct catalogue
  search access was unreliable; this is not proof that no adoption exists.
- Voluntary standard use, contractual requirements, and legal duties are distinct.
- A thermal image is not a complete electrical acceptance test. Part 1's stated
  scope does not automatically cover hybrid/storage systems.
- The selected criteria in the lesson are not a complete compliance checklist.
  Full applicable provisions, competent personnel and evidence remain necessary.

### Structured judgment

The useful teaching outcome is an evidence-based inspection decision: choose
the correct edition and scope, test acquisition quality, preserve source data,
and state limitations. Neither a radiometric drone nor one passing weather
reading establishes compliance. The synthetic exercise deliberately passes
several individual thresholds while failing cell sampling and documented
stabilisation. Its result is a reasoned repeat-acquisition decision.

### Actionable changes

Added `#thermal-standards`, a worked UAV example, a decision exercise, four quiz
questions and a downloadable evidence/deviation worksheet. F03 and F06 link to
the section. Existing lessons and learner-storage keys are preserved. This is
supplementary workshop material, not an increase to the declared 450-minute core.

## Source and claim map

| Source | Supports |
|---|---|
| [IEC catalogue](https://webstore.iec.ch/en/publication/28628) | Designation, type, publication date, edition and stability field. |
| [IEC-authored specification, distributor-hosted PDF](https://datatec.es/wp-content/uploads/2019/09/Normativa-IEC-TS-62446-3.pdf) | §4.2/table 1 equipment; §5.3/table 3 acquisition; §5.4.1 angle; §5.4.2 UAV; §8 reporting; annexes A–C. Read for verification, not redistributed. |
| [Authorized VDE preview](https://assets.vde-verlag.de/iec-normen/preview-pdf/info_iects62446-3%7Bed1.0%7Den.pdf) | Scope and document structure. |
| [PKN part 1](https://sklep.pkn.pl/pn-en-62446-1-2016-08e.html) | Documentation/commissioning scope and linked amendment A1:2019-01. |
| [PKN part 2](https://sklep.pkn.pl/normy/pn-en-iec-62446-2-2020-12e.html) | Maintenance scope and Polish designation. |
| [PKN voluntary application](https://www.pkn.pl/polskie-normy/informacje-o-pn/zagadnienia-prawne/dobrowolnosc-stosowania-norm) | Distinction between standards and legal obligations. |
| [IEA PVPS O&M](https://iea-pvps.org/wp-content/uploads/2022/11/IEA-PVPS-Report-T13-25-2022-OandM-Guidelines.pdf) | Independent primary technical guidance on POA and cell sampling. |
| [FLIR distance/size](https://www.flir.com/discover/professional-tools/understanding-distancesize-ratio/) | Distance, target size and measurement field relationship. |
| [DPS edition 2 project](https://dps.gov.al/en/project/show/iec:proj:134729) | Development status, not a published replacement. |

Numerical criteria were checked against the specification, not inferred from
catalogue abstracts. The 15-minute stabilisation item is labelled a recommendation.
The 3 m/s discussion is not presented as a universal flight-speed limit. The
640-pixel, 16-metre, 16×8-centimetre example is original synthetic arithmetic:
2.5 cm/pixel; 6.4×3.2 pixels; 1.6 cm/pixel maximum for five samples across 8 cm.

## Validation evidence

- Spec gate passed before implementation; 83 automated tests passed; static
  build and distribution reference validation passed (88 files, 21 references).
- Core course-plan validator passed: 18 lessons, 450 declared minutes,
  460.4 evidenced minutes, practice ratio 0.6.
- Browser quiz scored 12/12 with the answer key and 11/12 after changing the cell
  sampling answer; the expected explanatory feedback appeared.
- Worked-answer disclosure opened; section navigation reached the new material.
- Mobile 375×812 viewport: 360-pixel document content, no horizontal page overflow;
  both new tables fit their 278-pixel containers. Screenshot checked for legibility.
  Temporary viewport reset after inspection.
- Scoped dynamic OWASP check: an HTML/onerror fragment in the local URL created
  no injected image or JavaScript dialog; the section remained available.
  This is bounded injection validation, not a claim of a full penetration test.
- No new dependencies, accounts, network submission or learner-state format.

Publication and the downloadable asset are verified separately after deployment.
