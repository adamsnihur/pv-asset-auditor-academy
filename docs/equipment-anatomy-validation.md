# Equipment anatomy validation · 2026-09-19

Scope: six conceptual equipment families integrated into the existing 3D lab,
with 40 selectable parts, 24 explanatory stages and six worked examples.
The guided course and learner progression rules are unchanged.

## Evidence

- `npm run check`: 59 tests passed; Astro build and standalone artifact validation passed.
- Geometry tests use real Three.js meshes, bounding boxes, front-facing raycasts,
  material isolation and exact restoration after exploding the view.
- Browser: all 40 part buttons and 24 process buttons selected successfully.
- Browser: direct click on the MV breaker selected part 02; Enter selected the
  protection relay; the CT calculation disclosure showed the expected 100 A result.
- Browser: returning to the installation restored the original detail panel.
- Mobile viewport: document width and scroll width both 360 CSS pixels; canvas
  334 pixels wide. Checked model, controls and expanded worked example visually.
- No browser console errors in the tested session.
- Dynamic XSS probe: a local test note containing an `img`/`onerror` payload
  survived reload as literal textarea text; no injected image or dialog appeared.
  The previously empty note was restored to empty. Source links used HTTPS and
  `noopener`. `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- Static site has no new authentication, API, database or webhook surface;
  corresponding OWASP categories are outside this change's test scope.

## Limits

The geometry is a teaching abstraction, not a manufacturer's layout or wiring
diagram. Controls and descriptions do not teach switching or maintenance
operations. Text controls are independent of WebGL; forced WebGL failure was
not exercised in the browser. Build reports the existing large Three.js chunk
warning; the lab is lazy-loaded.

## Equipment content · Diarization Profile

**Sources:** primary manufacturer references linked in
`src/lib/pv-equipment-anatomy.mjs`; representative cross-check on 2026-09-19:
[Schneider SPD](https://www.electrical-installation.org/enwiki/The_Surge_Protection_Device_%28SPD%29),
[Janitza CT](https://www.janitza.com/en-us/know-how/knowledgebase/operation-of-current-transformers),
[SMA inverter](https://www.sma.de/en/partners/knowledgebase/inverters-power-electronics-for-a-clean-power-supply),
[ABB transformer stations](https://new.abb.com/docs/librariesprovider27/default-document-library/abb-transformerstations_ebook.pdf),
[Schneider PV reverse-current protection](https://www.electrical-installation.org/enwiki/PV_System%3A_how_to_ensure_safety_during_normal_operation),
[Janitza energy meters](https://energymeters.janitza.com).
**Confidence:** high for the foundational functional distinctions; deliberately
limited for any manufacturer-specific implementation or project selection.

### Claims and implementation

Sources distinguish power, protection, measurement and control functions.
The catalog reflects these distinctions; the illustration highlights parts
without presenting their positions as an executable electrical schematic.

### Timeline

| Date | Change | Significance |
|---|---|---|
| 2026-09-19 | External installation model extended with six internal views | Learner can connect named parts to their functions and common misconceptions. |

### Contradictions and simplifications

Equipment varies by installation: an LV switchboard need not contain RCD or N;
PV RCD requirements depend on the inverter and design. A dry transformer differs
from the illustrated oil-filled construction. These limits are stated in each
view rather than treating one arrangement as universal. Visual references to
undrawn signal paths were rewritten as functional explanations.

### Structured judgment

An effective introductory view should separate the function of a component,
the physical principle, the inspection context and a common misinterpretation.
Pairing these with selectable geometry and simple calculations helps explain
an installation without implying that the illustration authorizes intervention.

### Application

Keep source links beside each model. Future manufacturer-specific expansions
should introduce a separate identified construction with its own documentation,
rather than silently generalizing this teaching model.
