const storageKey = "csagent-normal-user-state";

const icons = {
  menu: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>',
  home: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-6h4v6"></path></svg>',
  course: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h10"></path><path d="M6 4v16"></path></svg>',
  wiki: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M4 5.5v16"></path><path d="M8 7h8"></path><path d="M8 11h8"></path></svg>',
  agents: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v3"></path><rect x="5" y="6" width="14" height="12" rx="4"></rect><path d="M9 13h.01"></path><path d="M15 13h.01"></path><path d="M10 17h4"></path><path d="M6 21h12"></path></svg>',
  private: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>',
  clock: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
  edit: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m14 5 5 5"></path><path d="M4 20h5L19 10l-5-5L4 15v5Z"></path></svg>',
  share: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.8 6.8-4.6"></path><path d="m8.6 13.2 6.8 4.6"></path></svg>',
  plus: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>'
};

const routes = [
  { id: "home", label: "Home", icon: icons.home },
  { id: "course", label: "Course", icon: icons.course },
  { id: "wiki", label: "Wiki", icon: icons.wiki },
  { id: "agents", label: "Agents", icon: icons.agents },
  { id: "private", label: "Private", icon: icons.private }
];

const enrolledCourses = [
  {
    id: "CS101",
    name: "Programming Fundamentals",
    subject: "Computer Science",
    notes: 42,
    sourceFiles: 15,
    access: "Full Access",
    progress: "Week 03 recursion reviewed",
    active: true
  },
  {
    id: "MATH202",
    name: "Linear Algebra",
    subject: "Mathematics",
    notes: 18,
    sourceFiles: 7,
    access: "Published Notes",
    progress: "Matrix properties pending review",
    active: true
  },
  {
    id: "PHIL201",
    name: "Ethics",
    subject: "Philosophy",
    notes: 24,
    sourceFiles: 9,
    access: "Published Notes",
    progress: "Categorical imperative article updated",
    active: false
  },
  {
    id: "STAT230",
    name: "Probability",
    subject: "Statistics",
    notes: 31,
    sourceFiles: 12,
    access: "Full Access",
    progress: "Bayes theorem source merge complete",
    active: true
  }
];

const recentWikiNotes = [
  {
    title: "Transformer Architecture",
    courseId: "CS101",
    section: "Machine Learning",
    updated: "2 days ago",
    citations: ["attention-is-all-you-need.pdf p. 2", "week-08-attention.pptx slide 14"]
  },
  {
    title: "Stack Frames",
    courseId: "CS101",
    section: "Recursion",
    updated: "Today",
    citations: ["week-03-recursion.pdf p. 4"]
  },
  {
    title: "Eigenvectors",
    courseId: "MATH202",
    section: "Linear Algebra",
    updated: "Yesterday",
    citations: ["linear-algebra-week-05.pdf p. 7"]
  }
];

const sourceFiles = [
  { id: "week-03-recursion.pdf", courseId: "CS101", kind: "PDF", status: "Indexed" },
  { id: "attention-slides-v2.pptx", courseId: "CS101", kind: "PPTX", status: "Reviewed" },
  { id: "linear-algebra-week-05.pdf", courseId: "MATH202", kind: "PDF", status: "Indexed" },
  { id: "ethics-reading-pack.docx", courseId: "PHIL201", kind: "DOCX", status: "Published notes only" }
];

const ChatEvidence = [
  {
    question: "Why does recursion need a base case?",
    answer: "A base case gives recursion a solved stopping point, so calls can return through the stack instead of expanding forever.",
    citations: ["Stack Frames", "week-03-recursion.pdf p. 4"]
  },
  {
    question: "Show the original stack frame slide.",
    answer: "This mock Accessible Member view can cite the Published Wiki Note but cannot expose the restricted original Source File.",
    citations: ["Stack Frames"],
    restricted: true
  },
  {
    question: "What will be on the final exam?",
    answer: "I do not have visible Course evidence for that. The Agent must not answer from model knowledge.",
    citations: []
  }
];

const PrivateGroup = [
  {
    name: "Finals Sprint",
    linkedCourse: "CS101",
    members: 6,
    mode: "Updates",
    owner: "Narin",
    joinCode: "FS-204"
  },
  {
    name: "Linear Algebra Lab",
    linkedCourse: "MATH202",
    members: 4,
    mode: "Inherited",
    owner: "Maya",
    joinCode: "LA-118"
  },
  {
    name: "Ethics Reading Circle",
    linkedCourse: "PHIL201",
    members: 5,
    mode: "Clean",
    owner: "Pim",
    joinCode: "ER-331"
  }
];

const futureRoadmap = [
  "Production Chula verification",
  "OCR/vision Enrollment Recognition",
  "multi-Course Private Groups",
  "hybrid vector retrieval",
  "Autonomous Agent publication",
  "Course Export packaging"
];

function routeFromKey(routeKey) {
  if (!routeKey) return null;
  const raw = decodeURIComponent(routeKey).trim();
  const id = raw.toLowerCase().replaceAll(" ", "-");
  return routes.find((route) => route.id === id || route.label.toLowerCase() === raw.toLowerCase()) || null;
}

function routeFromHash() {
  const raw = window.location.hash.slice(1);
  const route = routeFromKey(raw);
  return route ? route.label : null;
}

function loadState() {
  const fallback = {
    activeRoute: routeFromHash() || "Home",
    activeWikiTitle: "Transformer Architecture",
    activeQuestion: 0,
    selectedCourseId: "CS101",
    selectedFileId: "week-03-recursion.pdf",
    railCollapsed: false,
    profileOpen: false,
    theme: "light"
  };

  try {
    const stored = window.localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...fallback, ...parsed, activeRoute: routeFromHash() || parsed.activeRoute || fallback.activeRoute, profileOpen: false };
  } catch (error) {
    return fallback;
  }
}

const state = loadState();

function saveState() {
  try {
    const persisted = { ...state, profileOpen: false };
    window.localStorage.setItem(storageKey, JSON.stringify(persisted));
  } catch (error) {
    return undefined;
  }
}

function applyTheme() {
  const theme = state.theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  if (document.body) document.body.dataset.theme = theme;
  const shell = document.getElementById("appShell");
  if (shell) shell.dataset.theme = theme;
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
  saveState();
  renderApp();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function badge(label, tone = "") {
  return `<span class="badge ${tone}">${escapeHtml(label)}</span>`;
}

function currentCourse() {
  return enrolledCourses.find((course) => course.id === state.selectedCourseId) || enrolledCourses[0];
}

function currentSourceFile() {
  return sourceFiles.find((file) => file.id === state.selectedFileId) || sourceFiles[0];
}

function currentWikiNote() {
  return recentWikiNotes.find((note) => note.title === state.activeWikiTitle) || recentWikiNotes[0];
}

function setRoute(routeKey) {
  const route = routeFromKey(routeKey) || routes[0];
  state.activeRoute = route.label;
  state.profileOpen = false;
  const nextHash = `#${encodeURIComponent(route.id)}`;
  if (window.location.hash !== nextHash) window.history.replaceState(null, "", nextHash);
  saveState();
  renderApp();
}

function toggleProfileMenu() {
  state.profileOpen = !state.profileOpen;
  renderProfileMenu();
}

const sidebarDrag = {
  active: false,
  left: 0
};

function sidebarWidthFromPointer(event) {
  return Math.max(64, Math.min(252, event.clientX - sidebarDrag.left));
}

function startSidebarDrag(event) {
  const menu = document.getElementById("menuBar");
  sidebarDrag.active = true;
  sidebarDrag.left = menu.getBoundingClientRect().left;
  document.body.classList.add("is-resizing-sidebar");
  event.currentTarget.setPointerCapture?.(event.pointerId);
}

function updateSidebarDrag(event) {
  if (!sidebarDrag.active) return;
  document.getElementById("appShell").style.gridTemplateColumns = `${sidebarWidthFromPointer(event)}px minmax(0, 1fr)`;
}

function finishSidebarDrag(event) {
  if (!sidebarDrag.active) return;
  const width = sidebarWidthFromPointer(event);
  sidebarDrag.active = false;
  state.railCollapsed = width < 148;
  document.body.classList.remove("is-resizing-sidebar");
  document.getElementById("appShell").style.gridTemplateColumns = "";
  saveState();
  renderApp();
}

function toggleSidebarFromKeyboard() {
  state.railCollapsed = !state.railCollapsed;
  saveState();
  renderApp();
}

function renderMenuContext() {
  const selectedCourse = currentCourse();
  const selectedFile = currentSourceFile();
  const map = {
    Home: `
      <section class="menu-context" aria-label="Home context">
        <h3>Study Focus</h3>
        <div class="menu-stat"><strong>${escapeHtml(selectedCourse.id)}</strong><span class="muted">${escapeHtml(selectedCourse.progress)}</span></div>
      </section>
    `,
    Course: `
      <section class="menu-context" aria-label="Course context">
        <h3>Enrolled</h3>
        <div class="menu-stat"><strong>${enrolledCourses.length} Courses</strong><span class="muted">Normal User view</span></div>
      </section>
    `,
    Wiki: `
      <section class="menu-subsection" aria-label="Recently opened Course Wiki notes">
        <h3>Recent Wiki</h3>
        ${recentWikiNotes.map((note) => `
          <button class="recent-note" type="button" data-wiki-title="${escapeHtml(note.title)}" aria-current="${note.title === state.activeWikiTitle ? "page" : "false"}">
            <strong>${escapeHtml(note.title)}</strong>
            <span class="muted">${escapeHtml(note.courseId)} - ${escapeHtml(note.updated)}</span>
          </button>
        `).join("")}
      </section>
    `,
    Agents: `
      <section class="menu-context" aria-label="Agent context">
        <h3>Mock Context</h3>
        <div class="menu-stat"><strong>${escapeHtml(selectedCourse.id)}</strong><span class="muted">${escapeHtml(selectedFile.id)}</span></div>
      </section>
    `,
    Private: `
      <section class="menu-context" aria-label="Private context">
        <h3>Private Groups</h3>
        <div class="menu-stat"><strong>${PrivateGroup.length} Groups</strong><span class="muted">Single-Course pilot scope</span></div>
      </section>
    `
  };
  return map[state.activeRoute] || "";
}

function renderMenu() {
  const menu = document.getElementById("menuBar");
  menu.innerHTML = `
    <div class="brand-row">
      <div class="brand">
        <div class="brand-mark">CS</div>
        <div>
          <strong>CSAgent</strong>
          <span>Course Wiki</span>
        </div>
      </div>
    </div>
    <nav class="menu-nav" aria-label="Normal user navigation">
      ${routes.map((route) => `
        <button class="menu-route" type="button" data-route="${escapeHtml(route.id)}" aria-current="${route.label === state.activeRoute ? "page" : "false"}" title="${escapeHtml(route.label)}">
          <span class="route-icon">${route.icon}</span>
          <span class="menu-label">${escapeHtml(route.label)}</span>
        </button>
      `).join("")}
    </nav>
    ${renderMenuContext()}
    <div class="sidebar-drag-handle" role="separator" aria-orientation="vertical" aria-label="Drag sidebar to collapse or expand" tabindex="0" data-sidebar-drag></div>
  `;
}

function renderProfileMenu() {
  const profileButton = document.getElementById("profileButton");
  const profileMenu = document.getElementById("profileMenu");
  profileButton.setAttribute("aria-expanded", String(state.profileOpen));
  profileMenu.hidden = !state.profileOpen;
  profileMenu.innerHTML = `
    <div class="profile-head">
      <div class="profile-avatar">N</div>
      <div>
        <strong>Narin P.</strong>
        <div class="muted">Normal User</div>
      </div>
    </div>
    <section class="profile-section" aria-label="Notifications">
      <strong>Notifications</strong>
      <div class="activity-list">
        <div class="activity-item"><span class="small-icon">${icons.clock}</span><span>CS101 published <strong>Stack Frames</strong></span></div>
        <div class="activity-item"><span class="small-icon">${icons.clock}</span><span>MATH202 has one Source File ready for review.</span></div>
      </div>
    </section>
    <section class="profile-section" aria-label="Settings">
      <strong>Settings</strong>
      <button class="button" type="button" data-toggle-theme aria-pressed="${state.theme === "dark" ? "true" : "false"}">Dark mode</button>
      <button class="button" type="button">Account settings</button>
      <button class="button" type="button">Notification preferences</button>
    </section>
  `;
}

function renderHome() {
  return `
    <section class="view home-view" aria-label="Home">
      <article class="panel intro-panel">
        <span class="eyebrow">Home</span>
        <h1>Your study space is ready.</h1>
        <p class="muted">CSAgent is showing your active Courses, recently published Course Wiki notes, and evidence-first Agent activity for this class space.</p>
      </article>

      <section class="panel active-subjects" aria-label="Active subjects">
        <div class="section-head">
          <h2>Active Subjects</h2>
          <button class="button" type="button" data-route="course">View all Courses</button>
        </div>
        <div class="subject-grid">
          ${enrolledCourses.map((course) => `
            <article class="card subject-card">
              ${badge(course.active ? "Active" : "Following", course.active ? "green" : "blue")}
              <h3>${escapeHtml(course.id)}</h3>
              <p>${escapeHtml(course.name)}</p>
              <span class="source-pill">${course.notes} Notes</span>
              <button class="button" type="button" data-select-course="${escapeHtml(course.id)}" data-route="wiki">Open Wiki</button>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="panel home-subsection" aria-label="Today in CSAgent">
        <div class="section-head">
          <h2>Today in Your Courses</h2>
          <span class="muted">Mock subsection for the selected page</span>
        </div>
        <div class="grid-2">
          <article class="card">
            ${badge("Recent Activity", "blue")}
            <h3>Published Stack Frames</h3>
            <p class="muted">CS101 added a verified Course Wiki note from week-03-recursion.pdf.</p>
          </article>
          <article class="card">
            ${badge("Review", "gold")}
            <h3>Linear Algebra Matrix Properties</h3>
            <p class="muted">MATH202 has a draft summary ready for member review.</p>
          </article>
        </div>
      </section>
    </section>
  `;
}

function renderCourse() {
  return `
    <section class="view course-view" aria-label="Course">
      <article class="panel intro-panel">
        <span class="eyebrow">Course</span>
        <h1>Your enrolled Courses.</h1>
        <p class="muted">This normal User page lists every Course you can open. Future enrollment automation stays outside this UI until the backend scope is ready.</p>
      </article>
      <section class="course-grid">
        ${enrolledCourses.map((course) => `
          <article class="card">
            <div class="card-row">${badge(course.access, course.access === "Full Access" ? "green" : "blue")}<span class="muted">${course.sourceFiles} Source Files</span></div>
            <h3>${escapeHtml(course.id)} - ${escapeHtml(course.name)}</h3>
            <p>${escapeHtml(course.subject)}</p>
            <p class="muted">${escapeHtml(course.progress)}</p>
            <button class="button primary" type="button" data-select-course="${escapeHtml(course.id)}" data-route="wiki">Open Course Wiki</button>
          </article>
        `).join("")}
      </section>
      <article class="panel">
        <div class="section-head"><h2>Future Scope Notes</h2></div>
        <p class="muted">${futureRoadmap.map(escapeHtml).join(" | ")}</p>
      </article>
    </section>
  `;
}

function renderWiki() {
  const note = currentWikiNote();
  return `
    <section class="wiki-page" aria-label="Course Wiki">
      <div class="wiki-article-scroll">
        <article class="wiki-article">
          <div class="muted">${escapeHtml(note.courseId)} > ${escapeHtml(note.section)} > <strong>${escapeHtml(note.title)}</strong></div>
          <h1>${escapeHtml(note.title)}</h1>
          <div class="wiki-tools">
            <div>${badge("Verified", "green")} <span class="muted">Last edited ${escapeHtml(note.updated)}</span></div>
            <div class="wiki-action-group"><button class="icon-button wiki-icon-button" type="button" aria-label="Edit note">${icons.edit}</button><button class="icon-button wiki-icon-button" type="button" aria-label="Share note">${icons.share}</button></div>
          </div>
          <p>The Transformer is a deep learning architecture built around attention. This mock Course Wiki page keeps the center article independently scrollable while the right reference section remains fixed.</p>
          <h2 id="self-attention-mechanism">Self-Attention Mechanism</h2>
          <p>Self-attention lets each token weigh other tokens in the sequence before producing a contextual representation. CSAgent keeps claims tied to Course evidence and exposes citations when the User has access.</p>
          <div class="insight"><strong>Key Insight</strong><span>Unlike recurrent models, attention can compare positions across the sequence in parallel while preserving citation-backed explanations.</span></div>
          <h2 id="mathematical-formulation">Mathematical Formulation</h2>
          <p>The attention output maps a query and key-value pairs to a weighted representation. Course citations stay attached to the note so the Agent can answer from evidence only.</p>
          <pre class="code-block">Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V</pre>
          <h2 id="implementation-notes">Implementation Notes</h2>
          <p>For the first real website pass, this stays as a mock article. Later integration can replace this renderer with PublishedWikiNote data without changing the shell.</p>
        </article>
      </div>
      <aside class="wiki-context" aria-label="Wiki context">
        <section>
          <h3>On this page</h3>
          <div class="toc-list">
            <button class="toc-item active" type="button" data-toc-target="self-attention-mechanism">Self-Attention Mechanism</button>
            <button class="toc-item" type="button" data-toc-target="mathematical-formulation">Mathematical Formulation</button>
            <button class="toc-item" type="button" data-toc-target="implementation-notes">Implementation Notes</button>
          </div>
        </section>
        <section>
          <h3>Related Notes</h3>
          ${recentWikiNotes.filter((item) => item.title !== note.title).map((item) => `
            <button class="recent-note" type="button" data-wiki-title="${escapeHtml(item.title)}">
              <strong>${escapeHtml(item.title)}</strong>
              <span class="muted">${escapeHtml(item.courseId)} - ${escapeHtml(item.section)}</span>
            </button>
          `).join("")}
        </section>
        <section>
          <h3>Citations</h3>
          <div class="compact-list">
            ${note.citations.map((citation) => `<span class="source-pill">${escapeHtml(citation)}</span>`).join("")}
          </div>
        </section>
        <button class="button wiki-report-button" type="button">Report</button>
      </aside>
    </section>
  `;
}

function renderAgents() {
  const selectedCourse = currentCourse();
  const selectedFile = currentSourceFile();
  const active = ChatEvidence[state.activeQuestion] || ChatEvidence[0];
  return `
    <section class="view agents-view agent-chat" aria-label="Agents">
      <article class="panel intro-panel">
        <span class="eyebrow">Agents</span>
        <h1>Ask with Course evidence selected.</h1>
        <p class="muted">Agent chat mockups answer from ChatEvidence only. Use the plus controls to choose a Course and Source File context.</p>
      </article>
      <div class="agent-layout">
        <section class="panel">
          <div class="agent-toolbar">
            <button class="context-button" type="button" data-cycle-course>${icons.plus}<span>+ Course</span></button>
            <button class="context-button" type="button" data-cycle-file>${icons.plus}<span>+ File</span></button>
            ${badge(selectedCourse.id, "green")}
            ${badge(selectedFile.id, "blue")}
          </div>
          <div class="message-list">
            <div class="message"><strong>Question</strong><p>${escapeHtml(active.question)}</p></div>
            <div class="message agent"><strong>Answer</strong><p>${escapeHtml(active.answer)}</p><p><strong>Citations:</strong> ${escapeHtml(active.citations.join(" | ") || "No visible evidence citation")}</p>${active.restricted ? badge("Source Non-Disclosure active", "gold") : ""}</div>
          </div>
        </section>
        <aside class="card">
          <h2>Try examples</h2>
          <div class="compact-list">
            ${ChatEvidence.map((item, index) => `<button class="button" type="button" data-question="${index}">${escapeHtml(item.question)}</button>`).join("")}
          </div>
          <h3>Select Course</h3>
          <div class="agent-picker">
            ${enrolledCourses.map((course) => `<button class="context-button" type="button" data-select-course="${escapeHtml(course.id)}" aria-pressed="${course.id === selectedCourse.id ? "true" : "false"}">${escapeHtml(course.id)}</button>`).join("")}
          </div>
          <h3>Select File</h3>
          <div class="compact-list">
            ${sourceFiles.map((file) => `<button class="button" type="button" data-select-file="${escapeHtml(file.id)}">${escapeHtml(file.id)}</button>`).join("")}
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderPrivate() {
  return `
    <section class="view private-view" aria-label="Private">
      <article class="panel intro-panel">
        <span class="eyebrow">Private</span>
        <h1>Your private study groups.</h1>
        <p class="muted">PrivateGroup cards stay tied to one official Course in this first normal User UI. Cross-Course behavior is shown only as future scope.</p>
      </article>
      <section class="private-grid">
        ${PrivateGroup.map((group) => `
          <article class="card">
            <div class="card-row">${badge(group.mode, group.mode === "Clean" ? "blue" : "gold")}<span class="muted">${group.members} Members</span></div>
            <h3>${escapeHtml(group.name)}</h3>
            <p>Linked Course: <strong>${escapeHtml(group.linkedCourse)}</strong></p>
            <p class="muted">Owner: ${escapeHtml(group.owner)} | Join Code: ${escapeHtml(group.joinCode)}</p>
            <button class="button primary" type="button" data-select-course="${escapeHtml(group.linkedCourse)}" data-route="agents">Open Group Agent</button>
          </article>
        `).join("")}
      </section>
      <article class="panel">
        ${badge("Roadmap", "gold")}
        <h2>Private group future scope</h2>
        <p class="muted">multi-Course Private Groups remain planned for later, together with stronger enrollment and evidence retrieval workflows.</p>
      </article>
    </section>
  `;
}

function renderActiveRoute() {
  const renderers = {
    Home: renderHome,
    Course: renderCourse,
    Wiki: renderWiki,
    Agents: renderAgents,
    Private: renderPrivate
  };
  return renderers[state.activeRoute]();
}

function bindInteractions() {
  document.querySelectorAll("[data-sidebar-drag]").forEach((handle) => {
    handle.onpointerdown = startSidebarDrag;
    handle.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSidebarFromKeyboard();
      }
    };
  });

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.onclick = () => {
      if (button.dataset.selectCourse) state.selectedCourseId = button.dataset.selectCourse;
      setRoute(button.dataset.route);
    };
  });

  document.querySelectorAll("[data-wiki-title]").forEach((button) => {
    button.onclick = () => {
      state.activeWikiTitle = button.dataset.wikiTitle;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-question]").forEach((button) => {
    button.onclick = () => {
      state.activeQuestion = Number(button.dataset.question);
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-select-course]").forEach((button) => {
    if (button.dataset.route) return;
    button.onclick = () => {
      state.selectedCourseId = button.dataset.selectCourse;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-select-file]").forEach((button) => {
    button.onclick = () => {
      state.selectedFileId = button.dataset.selectFile;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-cycle-course]").forEach((button) => {
    button.onclick = () => {
      const currentIndex = enrolledCourses.findIndex((course) => course.id === state.selectedCourseId);
      const next = enrolledCourses[(currentIndex + 1) % enrolledCourses.length];
      state.selectedCourseId = next.id;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-cycle-file]").forEach((button) => {
    button.onclick = () => {
      const currentIndex = sourceFiles.findIndex((file) => file.id === state.selectedFileId);
      const next = sourceFiles[(currentIndex + 1) % sourceFiles.length];
      state.selectedFileId = next.id;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-toc-target]").forEach((button) => {
    button.onclick = () => {
      const target = document.getElementById(button.dataset.tocTarget);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelectorAll("[data-toc-target]").forEach((item) => item.classList.toggle("active", item === button));
    };
  });

  document.querySelectorAll("[data-floating-agent]").forEach((button) => {
    button.onclick = () => setRoute("agents");
  });
}

function renderApp() {
  const hashRoute = routeFromHash();
  if (hashRoute && hashRoute !== state.activeRoute) state.activeRoute = hashRoute;
  if (!routes.some((route) => route.label === state.activeRoute)) state.activeRoute = "Home";
  const shell = document.getElementById("appShell");
  applyTheme();
  shell.dataset.menu = state.railCollapsed ? "collapsed" : "expanded";
  shell.dataset.route = state.activeRoute.toLowerCase();
  renderMenu();
  document.getElementById("content").innerHTML = renderActiveRoute();
  renderProfileMenu();
  bindInteractions();
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  if (!target) return;
  if (target.closest("[data-toggle-theme]")) {
    toggleTheme();
    return;
  }
  if (target.closest("#profileButton")) {
    toggleProfileMenu();
    return;
  }
  if (!target.closest(".profile-area") && state.profileOpen) {
    state.profileOpen = false;
    renderProfileMenu();
  }
});

document.addEventListener("pointermove", updateSidebarDrag);
document.addEventListener("pointerup", finishSidebarDrag);
document.addEventListener("pointercancel", finishSidebarDrag);
window.addEventListener("hashchange", renderApp);
renderApp();
