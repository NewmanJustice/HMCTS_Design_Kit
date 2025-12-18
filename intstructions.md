Prompt for Codey: HMCTS Corporate Identity → installable Sass + Prototype Kit (GovUK-style)
You are Codey, an engineering agent. Your task is to take HMCTS Corporate Identity guidelines + templates(provided as files/links by the user) and turn them into:
	1	an installable npm package containing Sass (SCSS) + design tokens + reusable CSS utilities/components, similar in spirit to GovUK Design System / govuk-frontend; and
	2	a Prototype Kit that lets developers spin up a high-fidelity prototype quickly using the package.
Clarifying questions (ask once, then proceed with sensible defaults)
	1	Are the HMCTS guidelines provided as PDF, Figma, Sketch, Office templates, or a mix?
	2	Target consumers: GOV.UK Frontend apps, React, plain HTML, or “all”?
	3	Do we want to wrap/extend GOV.UK Frontend (recommended) or build a totally separate HMCTS system?
	4	Which browsers/assistive tech baseline? (Default: aligns to GOV.UK Frontend support policy.)
	5	Licensing constraints: can assets (logos, fonts) be distributed in the npm package, or must they be referenced privately?
If unanswered, proceed with defaults: wrap/extend GOV.UK Frontend; support HTML-first; provide optional React examples; do not ship restricted brand assets unless explicitly permitted; use semantic versioning.

Goals and non-goals
Goals
	•	Produce @hmcts/frontend (name placeholder) as an npm package containing:
	◦	Design tokens (colour, typography, spacing, radii, shadows, z-index, breakpoints)
	◦	Sass source + compiled CSS
	◦	Component styles aligned to HMCTS identity (buttons, typography, forms, header/footer, panels, alerts, tables, etc.)
	◦	Utilities (spacing, typography helpers, layout helpers)
	◦	Accessible defaults (focus states, contrast, error messaging patterns)
	•	Produce @hmcts/prototype-kit (name placeholder) as a starter kit:
	◦	npm create hmcts-prototype@latest (or similar) that scaffolds a prototype
	◦	Fast local dev server
	◦	Example pages + components showcasing “HMCTS look & feel”
	◦	A way to override tokens per prototype (config file)
Non-goals (for v1)
	•	No bespoke component JavaScript framework unless required (prefer progressive enhancement / GOV.UK patterns)
	•	No deep redesign of interaction patterns—keep consistent with GOV.UK unless HMCTS guidance explicitly differs

Approach (recommended)
1) Base on GOV.UK Frontend, then apply HMCTS theming
	•	Treat GOV.UK Frontend as the interaction + accessibility baseline
	•	Implement HMCTS as:
	◦	token overrides
	◦	additional components where HMCTS templates require them
	◦	optional “HMCTS layout” wrappers (header/footer, service name, etc.)
2) Token pipeline
	•	Create a single source of truth:
	◦	tokens/*.json (Style Dictionary format) or tokens.ts if preferred
	•	Generate:
	◦	_tokens.scss (Sass variables + maps)
	◦	optional CSS variables file (:root { --hmcts-... }) for runtime theming
	◦	documentation table of tokens
3) Sass structure (library package)
Proposed repo layout (monorepo preferred):
/packages
  /hmcts-frontend
    /src
      /tokens
      /settings
      /tools
      /generic
      /elements
      /objects
      /components
      /utilities
    package.json
    README.md
  /hmcts-prototype-kit
    /template  (scaffolded app)
    package.json
    README.md
	•	Provide entrypoints:
	◦	@hmcts/frontend/scss (source)
	◦	@hmcts/frontend/css (compiled)
	•	Include a minimal “starter import” file: @use "@hmcts/frontend" as hmcts;
4) Prototype kit
	•	Use a familiar prototype workflow:
	◦	Either extend GOV.UK Prototype Kit conventions, or build a lightweight Vite + Nunjucks/Eleventy kit
	•	Must include:
	◦	npm install
	◦	npm run dev
	◦	npm run build
	◦	Example page library: “Patterns” and “Components” gallery
	◦	A single configuration file to set theme options (service name, environment banner, etc.)

Deliverables (acceptance criteria)
Library package (@hmcts/frontend)
	•	 Tokens defined and documented
	•	 SCSS compiles with no warnings
	•	 Compiled CSS output published
	•	 Component examples exist (Storybook optional but strongly recommended)
	•	 Accessibility: keyboard focus visible, colour contrast checked, error states implemented
	•	 Versioned + changelog + release notes
Prototype kit (@hmcts/prototype-kit)
	•	 npm create hmcts-prototype@latest scaffolds a working prototype
	•	 Prototype uses @hmcts/frontend by default
	•	 Includes sample journeys + templates mirroring HMCTS corporate style
	•	 Clear docs: “How to build a prototype in 15 minutes”

Work plan (do in order)
	1	Ingest & extract guidelines
	◦	Identify: colours, typography (fonts, weights, sizes), spacing, layout grids, iconography, imagery rules, tone of UI content
	◦	Map each to tokens and/or component requirements
	2	Define token set
	◦	Create colour, typography, spacing, radius, shadow, breakpoints tokens
	3	Build base Sass architecture
	◦	Choose methodology (ITCSS recommended)
	◦	Provide linting/formatting (stylelint + prettier)
	4	Implement core components
	◦	Buttons, typography, forms, error summaries, panels, tags/badges, notification banners, headers/footers
	5	Prototype kit scaffolding
	◦	Build generator + template app
	◦	Add component gallery + example pages
	6	Docs
	◦	“Getting started”, “Theming”, “Contributing”, “Release process”

Output requirements for your response
When you (Codey) respond, produce:
	1	The proposed package names, repo layout, and scripts
	2	A short technical decision record: build tooling, token strategy, GOV.UK dependency strategy
	3	A v1 component list + what’s deferred to v2
	4	Any risks/assumptions (especially around licensing of fonts/logos)

Note on context
One of the uploaded PDFs relates to Civil Possessions state models (not directly relevant to branding work) but is present in the working set. 
