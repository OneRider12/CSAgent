const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appRoot = __dirname;
const repoRoot = path.resolve(appRoot, "..");

function readAppFile(fileName) {
  return fs.readFileSync(path.join(appRoot, fileName), "utf8");
}

function readRepoFile(fileName) {
  return fs.readFileSync(path.join(repoRoot, fileName), "utf8");
}

function extractFunctionSource(source, functionName) {
  const match = new RegExp(`function\\s+${functionName}\\s*\\(`).exec(source);
  const start = match ? match.index : -1;
  assert.notEqual(start, -1, `${functionName} should exist`);
  const next = source.indexOf("\nfunction ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

function routeLabels(source) {
  const match = source.match(/const routes = \[([\s\S]*?)\];/);
  assert.ok(match, "routes array should be declared");
  return [...match[1].matchAll(/label:\s*"([^"]+)"/g)].map((item) => item[1]);
}

function routeIds(source) {
  const match = source.match(/const routes = \[([\s\S]*?)\];/);
  assert.ok(match, "routes array should be declared");
  return [...match[1].matchAll(/id:\s*"([^"]+)"/g)].map((item) => item[1]);
}

test("real app uses split assets and compiles as standalone JavaScript", () => {
  const html = readAppFile("index.html");
  const script = readAppFile("app.js");

  assert.match(html, /<title>CSAgent<\/title>/);
  assert.match(html, /<link rel="stylesheet" href="\.\/styles\.css">/);
  assert.match(html, /<script src="\.\/app\.js"><\/script>/);
  assert.match(html, /id="appShell"/);
  assert.match(html, /id="menuBar"/);
  assert.match(html, /id="content"/);

  assert.doesNotThrow(() => new vm.Script(script));
});

test("real app builds CSS through the Tailwind CLI", () => {
  const html = readAppFile("index.html");
  const inputCss = readAppFile("tailwind.css");
  const pkg = JSON.parse(readRepoFile("package.json"));

  assert.equal(pkg.scripts["build:css"], "tailwindcss -i ./.app/tailwind.css -o ./.app/styles.css");
  assert.equal(pkg.scripts["watch:css"], "tailwindcss -i ./.app/tailwind.css -o ./.app/styles.css --watch");
  assert.equal(pkg.scripts.test, "node --test .app/app.test.js prototype.test.js planning-questionnaire.test.js");
  assert.ok(pkg.devDependencies.tailwindcss);
  assert.ok(pkg.devDependencies["@tailwindcss/cli"]);
  assert.match(inputCss, /^@import "tailwindcss" source\(none\);/m);
  assert.match(inputCss, /@source "\.\/index\.html";/);
  assert.match(inputCss, /@source "\.\/app\.js";/);
  assert.match(inputCss, /@theme\s*\{/);
  assert.match(html, /<link rel="stylesheet" href="\.\/styles\.css">/);
});

test("app typography uses Inter Sans with medium-bold emphasis", () => {
  const css = readAppFile("styles.css");

  assert.match(css, /font-family:\s*"Inter Sans", Inter, ui-sans-serif/);
  assert.match(css, /body\s*\{[\s\S]*font-family:\s*"Inter Sans", Inter, ui-sans-serif/);
  assert.match(css, /h1\s*\{[\s\S]*font-weight:\s*600;/);
  assert.match(css, /strong,\s*b\s*\{\s*font-weight:\s*600;/);
  assert.doesNotMatch(css, /font-weight:\s*(700|800|900)\b/);
});

test("menu is limited to normal-user routes and collapses with a draggable edge", () => {
  const html = readAppFile("index.html");
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderMenu = extractFunctionSource(script, "renderMenu");

  assert.deepEqual(routeLabels(script), ["Home", "Course", "Wiki", "Agents", "Private"]);
  assert.deepEqual(routeIds(script), ["home", "course", "wiki", "agents", "private"]);
  assert.doesNotMatch(script.match(/const routes = \[([\s\S]*?)\];/)[1], /Dashboard|Source Files|Review Queue|Graph|Course Export|Operator Log/);
  assert.doesNotMatch(html, /id="hamburgerButton"/);
  assert.doesNotMatch(script, /hamburger-button/);
  assert.match(script, /railCollapsed/);
  assert.match(script, /function routeFromKey/);
  assert.match(script, /function startSidebarDrag/);
  assert.match(script, /function finishSidebarDrag/);
  assert.match(renderMenu, /brand-row/);
  assert.match(renderMenu, /data-route="\$\{escapeHtml\(route\.id\)\}"/);
  assert.match(renderMenu, /sidebar-drag-handle/);
  assert.match(css, /\.app-shell\[data-menu="collapsed"\]\s*\{\s*grid-template-columns:\s*64px minmax\(0,\s*1fr\);/);
  assert.match(css, /\.app-shell\[data-menu="collapsed"\]\s+\.brand\s*\{\s*display:\s*none;/);
  assert.match(css, /\.sidebar-drag-handle\s*\{/);
  assert.match(css, /\.brand-row\s*\{/);
});

test("shell and topbar use tighter spacing with an expanded search area", () => {
  const css = readAppFile("styles.css");
  const html = readAppFile("index.html");

  assert.match(css, /\.app-shell\s*\{[\s\S]*gap:\s*12px;[\s\S]*padding:\s*10px;/);
  assert.match(css, /\.menu-bar\s*\{[\s\S]*height:\s*calc\(100vh - 20px\);[\s\S]*top:\s*10px;[\s\S]*padding:\s*24px 16px 16px;/);
  assert.match(css, /\.workspace\s*\{[\s\S]*gap:\s*12px;/);
  assert.match(html, /class="topbar-right"/);
  assert.match(css, /\.topbar\s*\{[\s\S]*top:\s*10px;[\s\S]*min-height:\s*66px;[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\) max-content;[\s\S]*padding:\s*0;/);
  assert.match(css, /\.search-box\s*\{[\s\S]*min-height:\s*54px;[\s\S]*max-width:\s*none;/);
  assert.match(css, /\.topbar-right\s*\{[\s\S]*min-height:\s*54px;[\s\S]*border:\s*1px solid var\(--line\);[\s\S]*border-radius:\s*9999px;[\s\S]*padding:\s*0 10px 0 14px;/);
});

test("wiki route exposes recent course wiki links as a menu subsection", () => {
  const script = readAppFile("app.js");
  const renderMenuContext = extractFunctionSource(script, "renderMenuContext");

  assert.match(renderMenuContext, /Recent Wiki/);
  assert.match(renderMenuContext, /recentWikiNotes/);
  assert.match(renderMenuContext, /menu-subsection/);
});

test("topbar profile menu owns notifications and settings", () => {
  const html = readAppFile("index.html");
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderProfileMenu = extractFunctionSource(script, "renderProfileMenu");

  assert.match(html, /class="topbar"/);
  assert.match(html, /id="profileButton"/);
  assert.match(html, /id="profileMenu"/);
  assert.match(script, /Notifications/);
  assert.match(script, /Settings/);
  assert.match(script, /function toggleProfileMenu/);
  assert.match(renderProfileMenu, /data-toggle-theme/);
  assert.match(renderProfileMenu, /Dark mode/);
  assert.match(script, /function toggleTheme\(\)/);
  assert.match(script, /state\.theme = state\.theme === "dark" \? "light" : "dark";/);
  assert.match(script, /target\.closest\("\[data-toggle-theme\]"\)/);
  assert.match(script, /function applyTheme\(\)/);
  assert.match(script, /document\.documentElement\.dataset\.theme/);
  assert.match(script, /document\.body\.dataset\.theme/);
  assert.match(script, /shell\.dataset\.theme/);
  assert.match(css, /html\[data-theme="dark"\]\s*\{[\s\S]*--surface:\s*#272b2e;[\s\S]*--surface-card:\s*#2d3134;/);
  assert.match(css, /html\[data-theme="dark"\]\s+\.code-block\s*\{[\s\S]*color:\s*#d6d6dc;/);
  assert.doesNotMatch(html, /id="notificationButton"|id="settingsButton"/);
});

test("home places active subjects immediately after the new intro copy", () => {
  const script = readAppFile("app.js");
  const renderHome = extractFunctionSource(script, "renderHome");
  const introIndex = renderHome.indexOf("intro-panel");
  const activeIndex = renderHome.indexOf("active-subjects");
  const subsectionIndex = renderHome.indexOf("home-subsection");

  assert.ok(introIndex !== -1, "intro panel should render");
  assert.ok(activeIndex > introIndex, "active subjects should follow intro");
  assert.ok(subsectionIndex > activeIndex, "home subsection should follow active subjects");
  assert.match(renderHome, /Your study space is ready/);
  assert.doesNotMatch(renderHome, /Welcome back/i);
});

test("wiki page scrolls only the center article and keeps the right section fixed", () => {
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderWiki = extractFunctionSource(script, "renderWiki");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");

  assert.match(renderWiki, /wiki-article-scroll/);
  assert.match(renderWiki, /wiki-context/);
  assert.match(renderWiki, /data-toc-target="self-attention-mechanism"/);
  assert.match(renderWiki, /id="mathematical-formulation"/);
  assert.match(renderWiki, /wiki-report-button/);
  assert.match(bindInteractions, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(css, /\.wiki-article-scroll\s*\{[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /\.wiki-context\s*\{[\s\S]*position:\s*sticky;/);
  assert.match(css, /\.wiki-report-button\s*\{[\s\S]*align-self:\s*end;[\s\S]*justify-self:\s*end;/);
});

test("wiki tools use spaced bare icon buttons", () => {
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderWiki = extractFunctionSource(script, "renderWiki");

  assert.match(renderWiki, /class="wiki-action-group"/);
  assert.match(renderWiki, /class="icon-button wiki-icon-button"/);
  assert.match(css, /\.wiki-action-group\s*\{[\s\S]*gap:\s*14px;/);
  assert.match(css, /\.wiki-icon-button\s*\{[\s\S]*border-color:\s*transparent;[\s\S]*background:\s*transparent;/);
});

test("agents page has chat mockups and plus controls for selecting course and file", () => {
  const script = readAppFile("app.js");
  const renderAgents = extractFunctionSource(script, "renderAgents");

  assert.match(script, /ChatEvidence/);
  assert.match(renderAgents, /\+ Course/);
  assert.match(renderAgents, /\+ File/);
  assert.match(renderAgents, /agent-chat/);
});

test("course and private pages preserve future-ready domain data without full future features", () => {
  const script = readAppFile("app.js");
  const renderCourse = extractFunctionSource(script, "renderCourse");
  const renderPrivate = extractFunctionSource(script, "renderPrivate");

  assert.match(script, /PrivateGroup/);
  assert.match(script, /futureRoadmap/);
  assert.match(script, /Production Chula verification/);
  assert.match(script, /OCR\/vision Enrollment Recognition/);
  assert.match(script, /multi-Course Private Groups/);
  assert.match(script, /hybrid vector retrieval/);
  assert.match(renderCourse, /enrolledCourses/);
  assert.match(renderPrivate, /PrivateGroup/);
  assert.doesNotMatch(script, /function\s+(verifyChulaEmail|runEnrollmentRecognition|buildHybridVectorRetrieval|syncPrivateGroupAcrossCourses)\b/);
});

test("cross-page controls select context without losing route navigation", () => {
  const script = readAppFile("app.js");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");
  const renderHome = extractFunctionSource(script, "renderHome");
  const renderCourse = extractFunctionSource(script, "renderCourse");
  const renderPrivate = extractFunctionSource(script, "renderPrivate");

  assert.match(bindInteractions, /if \(button\.dataset\.selectCourse\) state\.selectedCourseId = button\.dataset\.selectCourse;/);
  assert.match(bindInteractions, /setRoute\(button\.dataset\.route\);/);
  assert.match(bindInteractions, /if \(button\.dataset\.route\) return;/);
  assert.match(renderHome, /data-select-course/);
  assert.match(renderHome, /data-route="wiki"/);
  assert.match(renderCourse, /data-select-course="\$\{escapeHtml\(course\.id\)\}" data-route="wiki"/);
  assert.match(renderPrivate, /data-route="agents"/);
  assert.doesNotMatch(renderHome, /data-route="Home"/);
  assert.doesNotMatch(renderCourse, /data-route="Home"/);
  assert.doesNotMatch(renderPrivate, /data-route="Home"/);
});

test("real app does not import dashboard design themes or use gradients", () => {
  const combined = `${readAppFile("index.html")}\n${readAppFile("styles.css")}\n${readAppFile("app.js")}`;

  assert.doesNotMatch(combined, /lumen-grove|pearl-atelier|mist-graphite/i);
  assert.doesNotMatch(combined, /linear-gradient|radial-gradient/i);
});

test("visual accent is minimal slate rather than red or pink", () => {
  const css = readAppFile("styles.css");

  assert.match(css, /--primary:\s*#334155;/);
  assert.match(css, /--primary-soft:\s*#eef2f7;/);
  assert.match(css, /\.intro-panel\s*\{[\s\S]*border-left:\s*0;/);
  assert.doesNotMatch(css, /#a42e60|#87244f|#f8dce8|#dec3cc|#ead9df/i);
});
