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

test("login scaffold loads before the app and preserves pilot identity boundaries", () => {
  const html = readAppFile("index.html");
  const auth = readAppFile("auth.js");
  const gitignore = readRepoFile(".gitignore");

  assert.match(html, /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2"><\/script>/);
  assert.match(html, /<script src="\.\/config\.example\.js"><\/script>\s*<script src="\.\/config\.local\.js"><\/script>\s*<script src="\.\/auth\.js"><\/script>\s*<script src="\.\/app\.js"><\/script>/);
  assert.match(readAppFile("config.example.js"), /CSAGENT_SUPABASE_CONFIG/);
  assert.match(readAppFile("config.example.js"), /supabaseUrl/);
  assert.match(readAppFile("config.example.js"), /supabaseAnonKey/);
  assert.match(gitignore, /\.app\/config\.local\.js/);
  assert.match(auth, /window\.CSAgentAuth/);
  assert.match(auth, /createClient/);
  assert.match(auth, /signInWithOAuth\(\{\s*provider:\s*"google"/);
  assert.match(auth, /getSession/);
  assert.match(auth, /signInWithGoogle/);
  assert.match(auth, /signOut/);
  assert.match(auth, /onAuthChange/);
  assert.match(auth, /isConfigured/);
  assert.match(auth, /Verified Chula email is a release gate/);
  assert.doesNotMatch(auth, /signInWithGooglePilot|localStorage|service_role|verifyChulaEmail|sendOtp|magicLink|parseStudentIdentifier/);
});

test("temporary login bypass returns a removable mock session for web build work", () => {
  const auth = readAppFile("auth.js");
  const script = readAppFile("app.js");
  const loadSupabaseAppData = extractFunctionSource(script, "loadSupabaseAppData");
  const initializeAuth = extractFunctionSource(script, "initializeAuth");

  assert.match(auth, /temporaryLoginBypassEnabled\s*=\s*true/);
  assert.match(auth, /TODO: Remove this temporary bypass when the web login flow is ready/);
  assert.match(auth, /function temporaryBypassSession\(\)/);
  assert.match(auth, /temporary-bypass-member/);
  assert.match(auth, /isTemporaryBypass:\s*true/);
  assert.match(auth, /if \(temporaryLoginBypassEnabled\)/);
  assert.match(auth, /session:\s*temporaryBypassSession\(\)/);
  assert.match(loadSupabaseAppData, /state\.authSession\?\.isTemporaryBypass/);
  assert.match(loadSupabaseAppData, /state\.courses = enrolledCourses/);
  assert.match(loadSupabaseAppData, /state\.memberProfile = \{/);
  assert.match(initializeAuth, /result\?\.session/);
});

test("supabase migrations define identity and course slice with RLS", () => {
  const migration = readRepoFile("supabase/migrations/202607070001_identity_courses.sql");

  for (const table of ["class_spaces", "members", "courses", "course_enrollments"]) {
    assert.match(migration, new RegExp(`create table public\\.${table}`));
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
  }

  assert.match(migration, /create or replace function public\.handle_auth_user_member\(\)/);
  assert.match(migration, /on auth\.users/);
  assert.match(migration, /for each row execute function public\.handle_auth_user_member\(\)/);
  assert.match(migration, /insert into public\.class_spaces/);
  assert.match(migration, /insert into public\.courses/);
  assert.match(migration, /CS101/);
  assert.match(migration, /course_enrollments_member_id_fkey/);
  assert.match(migration, /auth\.uid\(\)/);
  assert.match(migration, /policy "members can read own member profile"/);
  assert.match(migration, /policy "members can read visible courses"/);
  assert.match(migration, /policy "members can manage own course enrollments"/);
  assert.doesNotMatch(migration, /service_role/i);
});

test("app typography backs up Inter Sans and uses the new brand/content/special font system", () => {
  const html = readAppFile("index.html");
  const inputCss = readAppFile("tailwind.css");
  const css = readAppFile("styles.css");
  const fontDraft = readRepoFile("ui-draft/fonts-draft.md");

  assert.match(fontDraft, /## Current Font Backup/);
  assert.match(fontDraft, /Inter Sans/);
  assert.match(fontDraft, /## New Font System/);
  assert.match(fontDraft, /Sora/);
  assert.match(fontDraft, /Source Sans 3/);
  assert.match(fontDraft, /JetBrains Mono/);
  assert.match(fontDraft, /STIX Two Math/);

  assert.match(html, /fonts\.googleapis\.com\/css2\?family=JetBrains\+Mono/);
  assert.match(inputCss, /--font-brand:/);
  assert.match(inputCss, /--font-content:/);
  assert.match(inputCss, /--font-code:/);
  assert.match(inputCss, /--font-math:/);
  assert.match(css, /--font-brand:\s*Sora/);
  assert.match(css, /--font-content:\s*"Source Sans 3"/);
  assert.match(css, /--font-code:\s*"JetBrains Mono"/);
  assert.match(css, /--font-math:\s*"STIX Two Math"/);
  assert.match(css, /body\s*\{[\s\S]*font-family:\s*var\(--font-content\)/);
  assert.match(css, /h1,\s*h2,\s*h3\s*\{[\s\S]*font-family:\s*var\(--font-brand\)/);
  assert.match(css, /code,\s*kbd,\s*samp,\s*\.code-text,\s*\.file-name,\s*\.course-id\s*\{[\s\S]*font-family:\s*var\(--font-code\)/);
  assert.match(css, /\.math-text,\s*\.latex-text,\s*math\s*\{[\s\S]*font-family:\s*var\(--font-math\)/);
});

test("web app uses the v2 transparent CSAgent PNGs as its deployed logos", () => {
  const html = readAppFile("index.html");
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderMenu = extractFunctionSource(script, "renderMenu");
  const renderLogin = extractFunctionSource(script, "renderLogin");
  const lightLogo = fs.readFileSync(path.join(appRoot, "assets", "CSAgent-logo-v2-light-transparent.png"));
  const darkLogo = fs.readFileSync(path.join(appRoot, "assets", "CSAgent-logo-v2-dark-transparent.png"));

  assert.ok(lightLogo.length > 0);
  assert.ok(darkLogo.length > 0);
  assert.match(html, /<link rel="icon" type="image\/png" href="\.\/assets\/CSAgent-logo-v2-light-transparent\.png">/);
  assert.match(renderMenu, /brand-logo-light" src="\.\/assets\/CSAgent-logo-v2-light-transparent\.png"/);
  assert.match(renderMenu, /brand-logo-dark" src="\.\/assets\/CSAgent-logo-v2-dark-transparent\.png"/);
  assert.match(renderLogin, /brand-logo-light" src="\.\/assets\/CSAgent-logo-v2-light-transparent\.png"/);
  assert.match(renderLogin, /brand-logo-dark" src="\.\/assets\/CSAgent-logo-v2-dark-transparent\.png"/);
  assert.doesNotMatch(renderMenu, /<div class="brand-mark">CS<\/div>/);
  assert.doesNotMatch(renderLogin, /<div class="brand-mark">CS<\/div>/);
  assert.match(css, /\.brand-logo\s*\{[\s\S]*width:\s*100%;[\s\S]*height:\s*100%;[\s\S]*object-fit:\s*contain;/);
});

test("menu is limited to normal-user routes and collapses with a brand icon button", () => {
  const html = readAppFile("index.html");
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderMenu = extractFunctionSource(script, "renderMenu");
  const renderMenuRouteButtons = extractFunctionSource(script, "renderMenuRouteButtons");

  assert.deepEqual(routeLabels(script), ["Course", "Agents", "Browse", "Wiki", "Group"]);
  assert.deepEqual(routeIds(script), ["course", "agents", "browse", "wiki", "private"]);
  assert.doesNotMatch(script.match(/const routes = \[([\s\S]*?)\];/)[1], /Dashboard|Source Files|Review Queue|Graph|Course Export|Operator Log/);
  assert.doesNotMatch(html, /id="hamburgerButton"/);
  assert.doesNotMatch(script, /hamburger-button/);
  assert.match(script, /railCollapsed/);
  assert.match(script, /function routeFromKey/);
  assert.match(script, /return \{ id: "home", label: "Home" \}/);
  assert.match(script, /function fixedMenuRoutes/);
  assert.match(script, /function scrollMenuRoutes/);
  assert.match(script, /\["course", "wiki"\]\.includes\(route\.id\)/);
  assert.match(script, /const routeIds = \["browse", "private", "agents"\]/);
  assert.doesNotMatch(script, /function startSidebarDrag/);
  assert.doesNotMatch(script, /function finishSidebarDrag/);
  assert.doesNotMatch(script, /data-sidebar-drag/);
  assert.match(script, /function toggleSidebar/);
  assert.match(script, /collapse: '<svg/);
  assert.doesNotMatch(script, /expand: '<svg/);
  assert.match(renderMenu, /brand-row/);
  assert.match(renderMenu, /class="brand brand-button"/);
  assert.match(renderMenu, /data-route="home"/);
  assert.match(renderMenu, /class="menu-collapse-button"/);
  assert.match(renderMenu, /data-toggle-sidebar/);
  assert.match(renderMenu, /state\.railCollapsed \? `<img class="menu-collapse-logo brand-logo-light" src="\.\/assets\/CSAgent-logo-v2-light-transparent\.png" alt=""><img class="menu-collapse-logo brand-logo-dark" src="\.\/assets\/CSAgent-logo-v2-dark-transparent\.png" alt="">` : icons\.collapse/);
  assert.match(renderMenu, /class="menu-nav menu-nav-fixed"/);
  assert.match(renderMenu, /class="menu-scroll-region"/);
  assert.match(renderMenu, /class="menu-nav menu-nav-scroll"/);
  assert.match(renderMenu, /menu-nav-scroll[\s\S]*renderMenuContext\(\)/);
  assert.match(renderMenu, /renderMenuRouteButtons\(fixedMenuRoutes\(\)\)/);
  assert.match(renderMenu, /renderMenuRouteButtons\(scrollMenuRoutes\(\)\)/);
  assert.match(renderMenuRouteButtons, /data-route="\$\{escapeHtml\(route\.id\)\}"/);
  assert.doesNotMatch(renderMenu, /sidebar-drag-handle/);
  assert.match(css, /\.menu-nav\s*\{[\s\S]*gap:\s*4px;/);
  assert.match(css, /\.menu-nav-fixed\s*\{[^}]*overflow:\s*visible;[^}]*\}/);
  assert.match(css, /\.menu-scroll-region\s*\{[^}]*flex:\s*1 1 auto;[^}]*overflow-y:\s*auto;[^}]*\}/);
  assert.doesNotMatch(css, /\.menu-nav-scroll\s*\{[^}]*overflow-y:\s*auto;[^}]*\}/);
  assert.match(css, /\.menu-route\s*\{[\s\S]*min-height:\s*38px;[\s\S]*padding:\s*7px 9px;/);
  assert.match(css, /\.route-icon,\s*\.small-icon\s*\{[\s\S]*width:\s*26px;[\s\S]*height:\s*26px;/);
  assert.match(css, /\.menu-scroll-region\s*\{[^}]*scrollbar-width:\s*thin;[^}]*scrollbar-color:\s*rgba\(102,\s*112,\s*134,\s*0\.58\) transparent;[^}]*\}/);
  assert.match(css, /\.menu-scroll-region::-webkit-scrollbar\s*\{[^}]*width:\s*8px;[^}]*\}/);
  assert.match(css, /\.menu-scroll-region::-webkit-scrollbar-thumb\s*\{[^}]*border-radius:\s*9999px;[^}]*background:\s*rgba\(102,\s*112,\s*134,\s*0\.58\);[^}]*background-clip:\s*content-box;[^}]*\}/);
  assert.match(css, /\.app-shell\s*\{[\s\S]*grid-template-columns:\s*292px minmax\(0,\s*1fr\);/);
  assert.match(css, /\.app-shell\[data-menu="collapsed"\]\s*\{\s*grid-template-columns:\s*72px minmax\(0,\s*1fr\);/);
  assert.match(css, /\.app-shell\[data-menu="collapsed"\]\s+\.brand\s*\{\s*display:\s*none;/);
  assert.doesNotMatch(css, /\.sidebar-drag-handle\s*\{/);
  assert.match(css, /\.menu-collapse-button\s*\{/);
  assert.match(css, /\.menu-collapse-logo\s*\{[^}]*width:\s*22px;[^}]*height:\s*22px;[^}]*object-fit:\s*contain;/);
  assert.match(css, /\.menu-section-more\s*\{[^}]*padding:\s*0;[^}]*background:\s*transparent;[^}]*text-decoration:\s*underline;[^}]*\}/);
  assert.match(css, /\.brand-row\s*\{/);
  assert.match(css, /\.brand\s*\{[\s\S]*border:\s*0;[\s\S]*background:\s*transparent;/);
  assert.match(css, /\.menu-scroll-region\s*\{[^}]*display:\s*grid;[^}]*align-content:\s*start;[^}]*gap:\s*8px;[^}]*\}/);
  assert.match(css, /\.menu-context\s*\{[^}]*gap:\s*8px;[^}]*\}/);
  assert.match(css, /\.menu-subsection\s*\{[^}]*padding-top:\s*8px;[^}]*border-top:\s*1px solid var\(--line-soft\);[^}]*\}/);
  assert.doesNotMatch(css, /\.menu-context\s*\{[^}]*border-top:/);
  assert.doesNotMatch(css, /\.menu-subsection\s*\{\s*margin-top:\s*auto;/);
});

test("shell and topbar use tighter spacing with an expanded search area", () => {
  const css = readAppFile("styles.css");
  const html = readAppFile("index.html");

  assert.match(css, /\.app-shell\s*\{[\s\S]*gap:\s*12px;[\s\S]*padding:\s*10px;/);
  assert.match(css, /\.menu-bar\s*\{[\s\S]*height:\s*calc\(100vh - 20px\);[\s\S]*top:\s*10px;[\s\S]*padding:\s*24px 18px 16px;/);
  assert.match(css, /\.workspace\s*\{[\s\S]*gap:\s*12px;/);
  assert.match(html, /class="topbar-right"/);
  assert.match(css, /\.topbar\s*\{[\s\S]*top:\s*10px;[\s\S]*min-height:\s*66px;[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\) max-content;[\s\S]*padding:\s*0;/);
  assert.match(css, /\.search-box\s*\{[\s\S]*min-height:\s*54px;[\s\S]*max-width:\s*none;/);
  assert.match(css, /\.topbar-right\s*\{[\s\S]*min-height:\s*54px;[\s\S]*border:\s*1px solid var\(--line\);[\s\S]*border-radius:\s*9999px;[\s\S]*padding:\s*0 10px 0 14px;/);
});

test("wiki route exposes recent course wiki links as a menu subsection", () => {
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderMenuContext = extractFunctionSource(script, "renderMenuContext");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");

  assert.doesNotMatch(renderMenuContext, /const map = \{/);
  assert.match(renderMenuContext, /<h3>Recent Wiki<\/h3>[\s\S]*data-wiki-title[\s\S]*<h3>Chat<\/h3>[\s\S]*data-menu-chat-question/);
  assert.match(renderMenuContext, /const visibleChatItems = menuVisibleItems\(chatItems, "chat"\);/);
  assert.match(renderMenuContext, /const visibleWikiNotes = recentWikiNotes\.slice\(0, menuCollapsedItemLimit\);/);
  assert.match(renderMenuContext, /menuVisibleItems\(chatItems, "chat"\)/);
  assert.match(renderMenuContext, /No recent Chat/);
  assert.match(renderMenuContext, /No recent Wiki/);
  assert.match(renderMenuContext, /menuHasMore\(chatItems\)/);
  assert.match(renderMenuContext, /data-toggle-menu-section="chat"/);
  assert.ok([...script.matchAll(/question:\s*"([^"]+)"/g)].length >= 4, "Chat menu needs enough items to expose More");
  assert.ok([...script.matchAll(/title:\s*"([^"]+)"/g)].length >= 4, "Recent Wiki needs enough items to expose More");
  assert.match(script, /const menuCollapsedItemLimit = 3;/);
  assert.match(script, /const menuExpandedItemLimit = 4;/);
  assert.match(script, /menuExpandedSections:\s*\{\s*chat:\s*false\s*\}/);
  assert.match(script, /function menuVisibleItems\(items, sectionId\)/);
  assert.match(script, /items\.slice\(0, menuSectionLimit\(sectionId\)\)/);
  assert.match(bindInteractions, /data-toggle-menu-section/);
  assert.match(script, /\[sectionId\]: !isMenuSectionExpanded\(sectionId\)/);
  assert.match(bindInteractions, /data-menu-chat-question/);
  assert.match(renderMenuContext, /aria-current="\$\{item\.index === state\.activeQuestion \? "page" : "false"\}"/);
  assert.match(bindInteractions, /setRoute\("agents"\)/);
  assert.match(css, /\.menu-section-head\s*\{/);
  assert.match(css, /\.menu-section-more\s*\{/);
  assert.doesNotMatch(renderMenuContext, /is-scrollable|is-expanded/);
  assert.doesNotMatch(css, /\.menu-section-list(?:\.is-scrollable|\.is-expanded)?\s*\{[^}]*overflow-y:\s*auto;|\.menu-section-list\.is-expanded/);
  assert.match(css, /\.menu-section-list\s*\{[^}]*gap:\s*4px;[^}]*\}/);
  assert.match(css, /\.menu-empty\s*\{/);
  assert.match(css, /\.menu-bar\s*\{[\s\S]*overflow-y:\s*hidden;/);
  assert.match(renderMenuContext, /Recent Wiki/);
  assert.match(renderMenuContext, /recentWikiNotes/);
  assert.doesNotMatch(renderMenuContext, /data-toggle-menu-section="recentWiki"|isMenuSectionExpanded\("recentWiki"\)|escapeHtml\(note\.courseId\)|escapeHtml\(note\.updated\)/);
  assert.match(renderMenuContext, /menu-subsection/);
  assert.doesNotMatch(renderMenuContext, /Study Focus|Enrolled|Mock Context|Private Groups/);
});

test("profile dropdown opens a dedicated settings overlay", () => {
  const html = readAppFile("index.html");
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderProfileMenu = extractFunctionSource(script, "renderProfileMenu");
  const renderSettingsOverlay = extractFunctionSource(script, "renderSettingsOverlay");
  const renderSettingsSection = extractFunctionSource(script, "renderSettingsSection");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");
  const renderApp = extractFunctionSource(script, "renderApp");

  assert.match(html, /class="topbar"/);
  assert.match(html, /id="profileButton"/);
  assert.match(html, /id="profileMenu"/);
  assert.match(script, /settingsOpen:\s*false/);
  assert.match(script, /settingsSection:\s*"account"/);
  assert.match(script, /function toggleProfileMenu/);
  assert.match(script, /function openSettingsOverlay/);
  assert.match(script, /function closeSettingsOverlay/);
  assert.match(script, /function setSettingsSection\(sectionId\)/);
  assert.match(renderProfileMenu, /profile-head/);
  assert.match(renderProfileMenu, /state\.memberProfile\.display_name/);
  assert.match(renderProfileMenu, /data-open-settings/);
  assert.match(renderProfileMenu, />Settings</);
  assert.doesNotMatch(renderProfileMenu, /Identity|Chula verification|Notifications|data-theme-choice|data-sign-out/);
  assert.match(renderSettingsOverlay, /settings-backdrop/);
  assert.match(renderSettingsOverlay, /role="dialog"/);
  assert.match(renderSettingsOverlay, /<h2 id="settingsTitle">Settings<\/h2>/);
  assert.doesNotMatch(renderSettingsOverlay, /eyebrow|Member settings|Manage account, identity, profile, preferences, and notifications/);
  assert.doesNotMatch(renderSettingsOverlay, /href="#settings-/);
  assert.match(renderSettingsOverlay, /settingsSections\.map/);
  assert.match(renderSettingsOverlay, /data-settings-section="\$\{escapeHtml\(section\.id\)\}"/);
  assert.match(renderSettingsOverlay, /aria-current="\$\{activeSection === section\.id \? "page" : "false"\}"/);
  assert.match(renderSettingsOverlay, /renderSettingsSection\(activeSection\)/);
  assert.doesNotMatch(renderSettingsOverlay, /id="settings-account"[\s\S]*id="settings-identity"/);
  assert.doesNotMatch(renderSettingsOverlay, /class="settings-backdrop"[^>]*data-close-settings/);
  assert.match(renderSettingsOverlay, /<button class="icon-button" type="button" data-close-settings aria-label="Close settings">x<\/button>/);
  assert.match(renderSettingsSection, /Account/);
  assert.doesNotMatch(script, /\{\s*id:\s*"identity",\s*label:\s*"Identity"\s*\}/);
  assert.doesNotMatch(renderSettingsSection, /section === "identity"/);
  assert.match(renderSettingsSection, /Chula verification/);
  assert.match(renderSettingsSection, /Profile/);
  assert.match(renderSettingsSection, /Google login/);
  assert.match(renderSettingsSection, /assets\/google-logo-transparent\.png/);
  assert.match(renderSettingsSection, /data-profile-image-upload/);
  assert.match(renderSettingsSection, /data-profile-image-input/);
  assert.match(renderSettingsSection, /1024 x 1024/);
  assert.match(renderSettingsSection, /class="profile-detail"/);
  assert.match(renderSettingsSection, /<h3 id="accessLabelsHeading">Access Labels<\/h3>/);
  assert.doesNotMatch(renderSettingsSection, /<div class="settings-row"><span>Access Labels<\/span>/);
  assert.match(renderSettingsSection, /Preferences/);
  assert.match(renderSettingsSection, /Notifications/);
  assert.match(renderSettingsSection, /More/);
  assert.match(renderSettingsSection, /Access Labels/);
  assert.match(renderSettingsSection, /data-theme-choice="\$\{escapeHtml\(option\.id\)\}"/);
  assert.match(renderSettingsSection, /theme-preview/);
  assert.match(renderSettingsSection, /option\.preview\.map/);
  assert.match(renderSettingsSection, /data-sign-out/);
  assert.doesNotMatch(bindInteractions, /data-open-settings/);
  assert.match(bindInteractions, /data-settings-section/);
  assert.match(bindInteractions, /setSettingsSection\(button\.dataset\.settingsSection\)/);
  assert.match(bindInteractions, /data-close-settings/);
  assert.match(bindInteractions, /data-profile-image-upload/);
  assert.match(bindInteractions, /data-profile-image-input/);
  assert.match(script, /function handleProfileImageSelection\(input\)/);
  assert.match(script, /image\.naturalWidth > 1024 \|\| image\.naturalHeight > 1024/);
  assert.doesNotMatch(bindInteractions, /settings-backdrop/);
  assert.match(script, /const settingsButton = target\.closest\("\[data-open-settings\]"\);[\s\S]*if \(settingsButton\) \{[\s\S]*openSettingsOverlay\(\);[\s\S]*return;[\s\S]*\}/);
  assert.match(renderApp, /renderSettingsOverlay\(\)/);
  assert.match(css, /\.settings-backdrop\s*\{/);
  assert.match(css, /\.settings-overlay\s*\{/);
  assert.match(css, /\.settings-overlay\s*\{[\s\S]*width:\s*min\(880px,\s*calc\(100vw - 48px\)\);[\s\S]*height:\s*min\(500px,\s*calc\(100vh - 48px\)\);/);
  assert.match(css, /\.settings-nav-item\.active,\s*\.settings-nav-item\[aria-current="page"\]\s*\{/);
  assert.match(css, /\.settings-panels\s*\{[\s\S]*padding-left:\s*24px;/);
  assert.match(css, /\.profile-image-upload\s*\{/);
  assert.match(css, /\.profile-detail\s*\{[\s\S]*background:\s*transparent;/);
  assert.match(css, /\.access-label-list\s*\{[\s\S]*flex-wrap:\s*wrap;/);
  assert.match(css, /\.theme-choice-grid\s*\{[\s\S]*grid-template-columns:\s*1fr;/);
  assert.match(css, /\.theme-choice\s*\{[\s\S]*justify-content:\s*space-between;/);
  assert.match(css, /\.theme-preview\s*\{[\s\S]*margin-left:\s*auto;/);
  assert.match(css, /\.theme-preview-swatch\s*\{/);
  assert.match(css, /transition:\s*background-color 200ms ease,\s*border-color 200ms ease,\s*color 200ms ease,\s*box-shadow 200ms ease/);
  assert.match(css, /@media \(max-width: 760px\)\s*\{[\s\S]*\.settings-overlay/);
  assert.match(script, /Lumen Grove/);
  assert.match(script, /Pearl Atelier/);
  assert.match(script, /Mist Graphite/);
  assert.match(script, /function setTheme\(theme\)/);
  assert.match(script, /themeOptions\.some\(\(option\) => option\.id === theme\)/);
  assert.match(script, /target\.closest\("\[data-theme-choice\]"\)/);
  assert.match(script, /function applyTheme\(\)/);
  assert.match(script, /document\.documentElement\.dataset\.theme/);
  assert.match(script, /document\.body\.dataset\.theme/);
  assert.match(script, /shell\.dataset\.theme/);
  assert.match(css, /html\[data-theme="lumen-grove"\]\s*\{[\s\S]*--surface:\s*#f7f8f3;[\s\S]*--primary:\s*#28785f;/);
  assert.match(css, /html\[data-theme="pearl-atelier"\]\s*\{[\s\S]*--surface:\s*#faf7f4;[\s\S]*--primary:\s*#9f4f59;/);
  assert.match(css, /html\[data-theme="mist-graphite"\]\s*\{[\s\S]*--surface:\s*#f4f7fa;[\s\S]*--primary:\s*#326d8a;/);
  assert.match(css, /html\[data-theme="dark"\]\s*\{[\s\S]*--surface:\s*#272b2e;[\s\S]*--surface-card:\s*#2d3134;/);
  assert.match(css, /html\[data-theme="dark"\]\s+\.code-block\s*\{[\s\S]*color:\s*#d6d6dc;/);
  assert.doesNotMatch(html, /id="notificationButton"|id="settingsButton"/);
});

test("signed-out users see a login gate before the app shell", () => {
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderLogin = extractFunctionSource(script, "renderLogin");
  const renderApp = extractFunctionSource(script, "renderApp");

  assert.match(script, /authLoading:\s*true/);
  assert.match(script, /authSetupError:\s*""/);
  assert.match(renderLogin, /login-view/);
  assert.match(renderLogin, /Continue with Google/);
  assert.doesNotMatch(renderLogin, /Private pilot access/);
  assert.match(renderLogin, /authSetupError/);
  assert.match(renderLogin, /Checking sign-in status/);
  assert.match(renderLogin, /Verified Chula email is required before the all-CS release/);
  assert.match(renderLogin, /data-login-google/);
  assert.match(renderApp, /if \(state\.authLoading \|\| !state\.authSession\)/);
  assert.match(renderApp, /signed-out/);
  assert.match(css, /\.login-view\s*\{/);
  assert.match(css, /\.login-card\s*\{/);
  assert.match(css, /\.login-button\s*\{/);
});

test("signed-in profile uses auth session and can sign out", () => {
  const script = readAppFile("app.js");
  const renderProfileMenu = extractFunctionSource(script, "renderProfileMenu");
  const renderSettingsOverlay = extractFunctionSource(script, "renderSettingsOverlay");
  const renderSettingsSection = extractFunctionSource(script, "renderSettingsSection");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");

  assert.match(renderProfileMenu, /state\.memberProfile\.display_name/);
  assert.match(renderSettingsSection, /state\.memberProfile\?\.identity_status/);
  assert.match(renderSettingsSection, /state\.memberProfile\?\.chula_verification_status/);
  assert.match(renderSettingsSection, /data-sign-out/);
  assert.match(bindInteractions, /await window\.CSAgentAuth\?\.signInWithGoogle\(\)/);
  assert.match(bindInteractions, /await window\.CSAgentAuth\?\.signOut\(\)/);
  assert.match(bindInteractions, /state\.authSession = null/);
});

test("home and course pages render Supabase loaded courses with empty and error states", () => {
  const script = readAppFile("app.js");
  const renderHome = extractFunctionSource(script, "renderHome");
  const renderCourse = extractFunctionSource(script, "renderCourse");

  assert.match(script, /async function loadSupabaseAppData/);
  assert.match(script, /\.from\("members"\)/);
  assert.match(script, /\.from\("courses"\)/);
  assert.match(script, /\.from\("course_enrollments"\)/);
  assert.match(script, /normalizeSupabaseCourses/);
  assert.match(script, /dataLoading:\s*false/);
  assert.match(script, /dataError:\s*""/);
  assert.match(renderHome, /state\.courses/);
  assert.match(renderHome, /state\.dataLoading/);
  assert.match(renderHome, /state\.dataError/);
  assert.match(renderHome, /No enrolled Courses yet/);
  assert.match(renderCourse, /state\.courses/);
  assert.match(renderCourse, /No Courses available/);
  assert.doesNotMatch(renderHome, /enrolledCourses\.map/);
  assert.doesNotMatch(renderCourse, /enrolledCourses\.map/);
});

test("browse page lists the mock platform course catalog", () => {
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderBrowse = extractFunctionSource(script, "renderBrowse");
  const renderCourse = extractFunctionSource(script, "renderCourse");
  const renderActiveRoute = extractFunctionSource(script, "renderActiveRoute");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");
  const courseCatalog = script.match(/const platformCourses = \[([\s\S]*?)\];/);

  assert.ok(courseCatalog, "platformCourses should be declared");
  assert.equal([...courseCatalog[1].matchAll(/id:\s*"([^"]+)"/g)].length, 5);
  assert.match(courseCatalog[1], /AI240/);
  assert.match(courseCatalog[1], /Never enrolled/);
  assert.match(courseCatalog[1], /never joined/);
  assert.match(courseCatalog[1], /permission:\s*"Accessible"/);
  assert.match(courseCatalog[1], /permission:\s*"Preview"/);
  assert.match(script, /pinnedCourseIds:\s*\["MATH202", "STAT230"\]/);
  assert.match(renderBrowse, /Browse platform Courses/);
  assert.match(renderBrowse, /platformCourses\.map/);
  assert.match(renderBrowse, /browse-toolbar/);
  assert.match(renderBrowse, /Pinned Course/);
  assert.match(renderBrowse, /data-toggle-pin/);
  assert.match(renderBrowse, /platformCourseAction\(course\.permission\)/);
  assert.match(renderBrowse, /data-route="course"/);
  assert.match(renderCourse, /selectedCourse\.description/);
  assert.doesNotMatch(renderCourse, /Course Overview/);
  assert.doesNotMatch(renderCourse, /data-route="agents"/);
  assert.doesNotMatch(renderCourse, />Chat</);
  assert.doesNotMatch(renderCourse, /Back to Browse/);
  assert.match(bindInteractions, /data-toggle-pin/);
  assert.match(bindInteractions, /togglePinnedCourse/);
  assert.match(renderActiveRoute, /Browse:\s*renderBrowse/);
  assert.match(css, /\.browse-view\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\) 280px;/);
  assert.match(css, /\.browse-list\s*\{[\s\S]*display:\s*grid;/);
  assert.match(css, /\.browse-toolbar\s*\{[\s\S]*position:\s*sticky;/);
  assert.match(css, /\.pinned-course-icon\.green\s*\{/);
  assert.match(css, /\.pinned-course-icon\.blue\s*\{/);
});

test("home places active subjects immediately after the new intro copy", () => {
  const script = readAppFile("app.js");
  const renderHome = extractFunctionSource(script, "renderHome");
  const renderPageHeader = extractFunctionSource(script, "renderPageHeader");
  const loadState = extractFunctionSource(script, "loadState");
  const initializeAuth = extractFunctionSource(script, "initializeAuth");
  const introIndex = renderHome.indexOf("renderPageHeader");
  const activeIndex = renderHome.indexOf("active-subjects");
  const subsectionIndex = renderHome.indexOf("home-subsection");

  assert.ok(introIndex !== -1, "page header should render");
  assert.ok(activeIndex > introIndex, "active subjects should follow intro");
  assert.ok(subsectionIndex > activeIndex, "home subsection should follow active subjects");
  assert.match(script, /const welcomeBackPhrases = \[/);
  assert.match(script, /function memberDisplayName\(\)/);
  assert.match(script, /function rotateWelcomeBackPhrase\(\)/);
  assert.match(loadState, /welcomePhraseIndex:\s*0/);
  assert.match(initializeAuth, /rotateWelcomeBackPhrase\(\)/);
  assert.match(renderHome, /Welcome Back \$\{escapeHtml\(memberDisplayName\(\)\)\}/);
  assert.match(renderPageHeader, /welcomeBackPhrases\[state\.welcomePhraseIndex % welcomeBackPhrases\.length\]/);
  assert.match(renderHome, /Your study space is ready/);
});

test("all page headers use text-only rotating copy and Course links to Browse", () => {
  const script = readAppFile("app.js");
  const css = readAppFile("styles.css");
  const renderHome = extractFunctionSource(script, "renderHome");
  const renderCourse = extractFunctionSource(script, "renderCourse");
  const renderBrowse = extractFunctionSource(script, "renderBrowse");
  const renderAgents = extractFunctionSource(script, "renderAgents");
  const renderPrivate = extractFunctionSource(script, "renderPrivate");
  const renderPageHeader = extractFunctionSource(script, "renderPageHeader");

  for (const renderer of [renderHome, renderCourse, renderBrowse, renderAgents, renderPrivate]) {
    assert.match(renderer, /renderPageHeader\(/);
    assert.doesNotMatch(renderer, /<span class="eyebrow">/);
  }
  assert.match(renderPageHeader, /page-header/);
  assert.match(renderPageHeader, /page-header-phrase/);
  assert.match(renderCourse, /Browse Course/);
  assert.match(renderCourse, /data-route="browse"/);
  assert.doesNotMatch(renderBrowse, /<span class="eyebrow">Browse<\/span>/);
  assert.doesNotMatch(renderAgents, /<span class="eyebrow">Agents<\/span>/);
  assert.doesNotMatch(renderPrivate, /<span class="eyebrow">Private<\/span>/);
  assert.match(renderBrowse, /renderPageHeader\("Browse platform Courses\./);
  assert.match(renderAgents, /renderPageHeader\("Ask with Course evidence selected\./);
  assert.match(renderPrivate, /renderPageHeader\("Your private study groups\./);
  assert.match(css, /\.page-header\s*\{[\s\S]*background:\s*transparent;[\s\S]*box-shadow:\s*none;/);
  assert.match(css, /\.page-header\s*\{[\s\S]*padding:\s*26px 18px 32px;/);
  assert.match(css, /\.page-header h1\s*\{[\s\S]*text-shadow:/);
  assert.match(css, /\.wiki-page-header h1\s*\{[\s\S]*text-shadow:\s*none;/);
});

test("wiki page scrolls at the document level while the right section stays fixed", () => {
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderWiki = extractFunctionSource(script, "renderWiki");
  const renderWikiLanding = extractFunctionSource(script, "renderWikiLanding");
  const renderWikiArticle = extractFunctionSource(script, "renderWikiArticle");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");

  assert.match(script, /wikiView:\s*"landing"/);
  assert.match(renderWiki, /state\.wikiView === "article" \? renderWikiArticle\(\) : renderWikiLanding\(\)/);
  assert.match(renderWikiLanding, /wiki-landing/);
  assert.match(renderWikiLanding, /About \$\{escapeHtml\(course\.name\)\}/);
  assert.match(renderWikiLanding, /wiki-action-stack/);
  assert.match(renderWikiLanding, />Upload Source</);
  assert.match(renderWikiLanding, />Graph View</);
  assert.match(renderWikiLanding, /wiki-action-spacer/);
  assert.match(renderWikiLanding, />To Source</);
  assert.doesNotMatch(renderWikiLanding, />Upload</);
  assert.doesNotMatch(renderWikiLanding, />To map</);
  assert.doesNotMatch(renderWikiLanding, />Source</);
  assert.match(renderWikiLanding, /data-wiki-view="article"/);
  assert.match(renderWikiArticle, /wiki-article-scroll/);
  assert.match(renderWikiArticle, /wiki-context/);
  assert.match(renderWikiArticle, /data-toc-target="self-attention-mechanism"/);
  assert.match(renderWikiArticle, /id="mathematical-formulation"/);
  assert.match(renderWikiArticle, /wiki-report-button/);
  assert.match(bindInteractions, /state\.wikiView = "article";/);
  assert.match(bindInteractions, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(css, /\.wiki-article-scroll,\s*\.wiki-context\s*\{[^}]*scrollbar-width:\s*thin;[^}]*scrollbar-color:\s*rgba\(102,\s*112,\s*134,\s*0\.58\) transparent;[^}]*\}/);
  assert.match(css, /\.wiki-article-scroll::-webkit-scrollbar,\s*\.wiki-context::-webkit-scrollbar\s*\{[^}]*width:\s*8px;[^}]*\}/);
  assert.match(css, /\.wiki-article-scroll::-webkit-scrollbar-button,\s*\.wiki-context::-webkit-scrollbar-button\s*\{[^}]*display:\s*none;[^}]*width:\s*0;[^}]*height:\s*0;[^}]*\}/);
  assert.match(css, /\.wiki-article-scroll\s*\{[\s\S]*max-height:\s*none;[\s\S]*overflow-y:\s*visible;/);
  assert.doesNotMatch(css, /\.wiki-article-scroll\s*\{[\s\S]*max-height:\s*calc\(100vh - 92px\);[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /html::-webkit-scrollbar-button\s*\{[\s\S]*display:\s*none;[\s\S]*width:\s*0;[\s\S]*height:\s*0;/);
  assert.match(css, /\.wiki-article\s*\{[\s\S]*padding:\s*40px min\(4vw,\s*52px\);/);
  assert.match(css, /\.wiki-context\s*\{[\s\S]*position:\s*sticky;/);
  assert.match(css, /\.wiki-action-stack\s*\{[\s\S]*display:\s*grid;[\s\S]*grid-template-columns:\s*1fr;/);
  assert.match(css, /\.wiki-action-spacer\s*\{[\s\S]*min-height:\s*24px;/);
  assert.match(css, /\.wiki-action-stack\s+\.button\s*\{[\s\S]*width:\s*100%;/);
  assert.match(css, /\.wiki-report-button\s*\{[\s\S]*align-self:\s*end;[\s\S]*justify-self:\s*end;/);
});

test("wiki article text is arranged for readable scanning", () => {
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderWikiArticle = extractFunctionSource(script, "renderWikiArticle");

  assert.doesNotMatch(renderWikiArticle, /class="wiki-meta muted"/);
  assert.match(renderWikiArticle, /class="wiki-lead"/);
  assert.match(renderWikiArticle, /class="wiki-readable"/);
  assert.ok((renderWikiArticle.match(/class="wiki-section"/g) || []).length >= 3);
  assert.match(css, /\.wiki-article\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*760px\);[\s\S]*justify-content:\s*center;/);
  assert.match(css, /\.wiki-readable\s*\{[\s\S]*display:\s*grid;[\s\S]*gap:\s*26px;/);
  assert.match(css, /\.wiki-lead\s*\{[\s\S]*font-size:\s*18px;[\s\S]*line-height:\s*31px;/);
  assert.match(css, /\.wiki-section\s*\{[\s\S]*display:\s*grid;[\s\S]*gap:\s*12px;/);
  assert.match(css, /\.wiki-article p\s*\{[\s\S]*max-width:\s*68ch;[\s\S]*font-size:\s*16px;[\s\S]*line-height:\s*28px;/);
  assert.match(css, /\.wiki-article h1\s*\{[\s\S]*max-width:\s*14ch;[\s\S]*font-size:\s*40px;[\s\S]*line-height:\s*48px;/);
  assert.match(css, /\.wiki-article h2\s*\{[\s\S]*font-size:\s*24px;[\s\S]*line-height:\s*32px;/);
});

test("wiki overview upload opens a responsive file uploader modal", () => {
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderWikiLanding = extractFunctionSource(script, "renderWikiLanding");
  const renderUploadModal = extractFunctionSource(script, "renderUploadModal");
  const bindInteractions = extractFunctionSource(script, "bindInteractions");

  assert.match(script, /uploadModalOpen:\s*false/);
  assert.match(script, /selectedUploadFiles:\s*\[\]/);
  assert.match(renderWikiLanding, /data-open-upload-modal/);
  assert.match(renderWikiLanding, />Upload Source</);
  assert.match(renderUploadModal, /role="dialog"/);
  assert.match(renderUploadModal, /Add to Knowledge Base/);
  assert.match(renderUploadModal, /Drag and drop files/);
  assert.match(renderUploadModal, /Browse Files/);
  assert.match(renderUploadModal, /type="file"/);
  assert.match(renderUploadModal, /multiple/);
  assert.match(renderUploadModal, /accept="\.pdf,\.docx,\.png,\.jpg,\.jpeg"/);
  assert.match(renderUploadModal, /Subject Context/);
  assert.match(renderUploadModal, /Temporal Marker/);
  assert.match(renderUploadModal, /Brief Description/);
  assert.match(renderUploadModal, /upload-file-sidebar/);
  assert.match(renderUploadModal, /Files to upload/);
  assert.match(renderUploadModal, /upload-file-name/);
  assert.match(renderUploadModal, /upload-file-type/);
  assert.match(renderUploadModal, /Supported formats: \.pdf, \.docx, \.png, \.jpg \(Max 50MB\)/);
  assert.match(bindInteractions, /data-browse-upload/);
  assert.match(bindInteractions, /\.click\(\)/);
  assert.match(bindInteractions, /data-upload-input/);
  assert.match(bindInteractions, /filesToUpload\(input\.files/);
  assert.match(bindInteractions, /data-close-upload-modal/);
  assert.match(bindInteractions, /data-upload-dropzone/);
  assert.match(bindInteractions, /\.upload-modal select, \.upload-modal textarea/);
  assert.match(bindInteractions, /event\.stopPropagation\(\)/);
  assert.match(css, /\.upload-backdrop\s*\{/);
  assert.match(css, /\.upload-modal\s*\{/);
  assert.match(css, /\.upload-modal\s*\{[\s\S]*width:\s*min\(1120px,\s*calc\(100vw - 48px\)\);/);
  assert.match(css, /\.upload-dropzone\s*\{/);
  assert.match(css, /\.upload-body-grid\s*\{/);
  assert.match(css, /\.upload-body-grid\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\) 300px;/);
  assert.match(css, /\.upload-file-sidebar\s*\{[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /\.upload-form-grid select,\s*\.upload-description textarea\s*\{[\s\S]*pointer-events:\s*auto;/);
  assert.match(css, /@media \(max-width: 760px\)\s*\{[\s\S]*\.upload-modal/);
});

test("wiki tools use spaced bare icon buttons", () => {
  const css = readAppFile("styles.css");
  const script = readAppFile("app.js");
  const renderWikiArticle = extractFunctionSource(script, "renderWikiArticle");

  assert.match(renderWikiArticle, /class="wiki-action-group"/);
  assert.match(renderWikiArticle, /class="icon-button wiki-icon-button"/);
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
  assert.match(renderCourse, /state\.courses/);
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
  assert.match(bindInteractions, /if \(button\.dataset\.wikiView\) state\.wikiView = button\.dataset\.wikiView;/);
  assert.match(bindInteractions, /if \(button\.dataset\.route\) return;/);
  assert.match(bindInteractions, /state\.wikiView = "article";[\s\S]*setRoute\("wiki"\);/);
  assert.match(renderHome, /data-select-course/);
  assert.match(renderHome, /data-route="wiki" data-wiki-view="landing"/);
  assert.match(renderCourse, /data-select-course="\$\{escapeHtml\(course\.id\)\}" data-route="wiki" data-wiki-view="landing"/);
  assert.match(renderCourse, />To Wiki</);
  assert.doesNotMatch(renderCourse, /Open Course Wiki/);
  assert.match(renderPrivate, /data-route="agents"/);
  assert.doesNotMatch(renderHome, /data-route="Home"/);
  assert.doesNotMatch(renderCourse, /data-route="Home"/);
  assert.doesNotMatch(renderPrivate, /data-route="Home"/);
});

test("real app theme selection does not use gradients", () => {
  const combined = `${readAppFile("index.html")}\n${readAppFile("styles.css")}\n${readAppFile("app.js")}`;

  assert.doesNotMatch(combined, /linear-gradient|radial-gradient/i);
});

test("default visual accent remains minimal slate", () => {
  const css = readAppFile("styles.css");

  assert.match(css, /--primary:\s*#334155;/);
  assert.match(css, /--primary-soft:\s*#eef2f7;/);
  assert.match(css, /\.page-header\s*\{[\s\S]*background:\s*transparent;/);
});
