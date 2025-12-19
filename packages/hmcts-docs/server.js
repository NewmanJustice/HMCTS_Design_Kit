"use strict";

const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");

const components = [
  // Layout
  { slug: "header", title: "Header (top navigation)", section: "Layout" },
  { slug: "side-nav", title: "Side navigation", section: "Layout" },
  { slug: "footer", title: "Footer", section: "Layout" },
  // Components
  { slug: "button", title: "Button", section: "Components" },
  { slug: "notification", title: "Notification", section: "Components" },
  { slug: "forms", title: "Form input", section: "Components" },
  { slug: "error-summary", title: "Error summary", section: "Components" },
  { slug: "summary-list", title: "Summary list", section: "Components" },
  { slug: "inset-text", title: "Inset text", section: "Components" },
  { slug: "warning-text", title: "Warning text", section: "Components" }
];

const patterns = [
  { slug: "check-your-answers", title: "Check your answers" },
  { slug: "form-with-errors", title: "Form with errors" },
  { slug: "confirmation", title: "Confirmation page" },
];



const app = express();

// ---- Basic Auth ----
const USER = process.env.DOCS_USER;
const PASS = process.env.DOCS_PASS;

if (!USER || !PASS) {
  console.error("Missing DOCS_USER or DOCS_PASS environment variables.");
  process.exit(1);
}

app.use((req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, encoded] = header.split(" ");

  if (scheme !== "Basic" || !encoded) {
    res.set("WWW-Authenticate", 'Basic realm="HMCTS Docs"');
    return res.status(401).send("Authentication required.");
  }

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [username, password] = decoded.split(":");

  if (username === USER && password === PASS) return next();

  res.set("WWW-Authenticate", 'Basic realm="HMCTS Docs"');
  return res.status(401).send("Invalid credentials.");
});

// ---- Static assets ----
app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "hmcts-frontend", "dist"))
);

// ---- Views (Nunjucks) ----
const viewsPath = path.join(__dirname, "views");
nunjucks.configure(viewsPath, { autoescape: true, express: app });

app.set("view engine", "njk");
app.set("views", viewsPath);

app.use((req, res, next) => {
  const withHrefs = components.map(c => ({
    ...c,
    href: `/components/${c.slug}`
  }));

  // Group by section
  const sections = withHrefs.reduce((acc, item) => {
    const key = item.section || "Components";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  // Control section order explicitly
  const sectionOrder = ["Layout", "Components"];
  const grouped = sectionOrder
    .filter(name => sections[name])
    .map(name => ({ title: name, items: sections[name] }));

  res.locals.nav = {
    groupedComponents: grouped,
    patterns: patterns.map(p => ({
      ...p,
      href: `/patterns/${p.slug}`
    }))
  };

  res.locals.nav.patterns = patterns.map(p => ({
    ...p,
    href: `/patterns/${p.slug}`
  }));

  res.locals.activeTopNav =
  req.path === "/" ? "overview" :
  req.path.startsWith("/layout") ? "layout" :
  req.path.startsWith("/components") ? "components" :
  req.path.startsWith("/patterns") ? "patterns" :
  null;

  res.locals.activeSideNav =
  req.path === "/" ? "overview" :
  req.path === "/layout" ? "layout-index" :
  req.path === "/components" ? "components-index" :
  req.path === "/patterns" ? "patterns-index" :
  req.path.startsWith("/components/") ? req.path.split("/")[2] :
  req.path.startsWith("/patterns/") ? req.path.split("/")[2] :
  null;

  next();
});

// ---- routes ----
app.get("/", (req, res) => {
  res.render("pages/index.njk", {
    pageTitle: "Overview",
    activeTopNav: "overview",
    activeSideNav: "overview"
  });
});

app.get("/patterns", (req, res) => {
  res.render("pages/patterns/index.njk", {
    pageTitle: "Patterns"
  });
});

app.get("/patterns/:slug", (req, res) => {
  const pattern = patterns.find(p => p.slug === req.params.slug);
  if (!pattern) return res.status(404).send("Not found");

  res.render(`pages/patterns/${pattern.slug}.njk`, {
    pageTitle: pattern.title
  });
});


app.get("/layout", (req, res) => {
  res.render("pages/layout/index.njk", {
    pageTitle: "Layout"
  });
});

app.get("/components", (req, res) => {
  res.render("pages/components/index.njk", {
    pageTitle: "Components"
  });
});


app.get("/components/:slug", (req, res) => {
  const { slug } = req.params;

  const component = components.find(c => c.slug === slug);
  if (!component) return res.status(404).send("Not found");

  res.render(`pages/components/${slug}.njk`, {
    pageTitle: component.title
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`HMCTS docs running on http://localhost:${port}`));
