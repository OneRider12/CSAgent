const storageKey = "csagent-normal-user-state";

const icons = {
  menu: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>',
  collapse: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"></path></svg>',
  home: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-6h4v6"></path></svg>',
  course: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h10"></path><path d="M6 4v16"></path></svg>',
  browse: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="m15 9-2 5-5 2 2-5 5-2Z"></path></svg>',
  wiki: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M4 5.5v16"></path><path d="M8 7h8"></path><path d="M8 11h8"></path></svg>',
  agents: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v3"></path><rect x="5" y="6" width="14" height="12" rx="4"></rect><path d="M9 13h.01"></path><path d="M15 13h.01"></path><path d="M10 17h4"></path><path d="M6 21h12"></path></svg>',
  private: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>',
  clock: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
  edit: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m14 5 5 5"></path><path d="M4 20h5L19 10l-5-5L4 15v5Z"></path></svg>',
  share: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.8 6.8-4.6"></path><path d="m8.6 13.2 6.8 4.6"></path></svg>',
  pin: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m15 4 5 5-4 1-4 8-2-4-4-2 8-4 1-4Z"></path><path d="m9 15-5 5"></path></svg>',
  unlock: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 7.5-2"></path></svg>',
  eye: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  plus: '<svg class="svg-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>'
};

const routes = [
  { id: "course", label: "Course", icon: icons.course },
  { id: "agents", label: "Agents", icon: icons.agents },
  { id: "browse", label: "Browse", icon: icons.browse },
  { id: "wiki", label: "Wiki", icon: icons.wiki },
  { id: "private", label: "Group", icon: icons.private }
];

const welcomeBackPhrases = [
  "Ready to pick up where you left off.",
  "Your Course evidence is waiting.",
  "Fresh notes are ready for review.",
  "Let's get your study context back in view."
];

const themeOptions = [
  { id: "light", label: "Default", preview: ["#f8f9ff", "#ffffff", "#334155"] },
  { id: "dark", label: "Dark", preview: ["#272b2e", "#2d3134", "#d1d5db"] },
  { id: "lumen-grove", label: "Lumen Grove", preview: ["#f7f8f3", "#d7eee5", "#28785f"] },
  { id: "pearl-atelier", label: "Pearl Atelier", preview: ["#faf7f4", "#f7dddd", "#9f4f59"] },
  { id: "mist-graphite", label: "Mist Graphite", preview: ["#f4f7fa", "#dbeaf1", "#326d8a"] }
];

const settingsSections = [
  { id: "account", label: "Account" },
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "more", label: "More" }
];

const enrolledCourses = [
  { id: "CS101", name: "Programming Fundamentals", subject: "Computer Science", notes: 42, sourceFiles: 15, access: "Full Access", progress: "Week 03 recursion reviewed", active: true },
  { id: "MATH202", name: "Linear Algebra", subject: "Mathematics", notes: 18, sourceFiles: 7, access: "Published Notes", progress: "Matrix properties pending review", active: true },
  { id: "PHIL201", name: "Ethics", subject: "Philosophy", notes: 24, sourceFiles: 9, access: "Published Notes", progress: "Categorical imperative article updated", active: false },
  { id: "STAT230", name: "Probability", subject: "Statistics", notes: 31, sourceFiles: 12, access: "Full Access", progress: "Bayes theorem source merge complete", active: true }
];

const platformCourses = [
  { id: "CS101", name: "Programming Fundamentals", subject: "Computer Science", term: "Core", permission: "Accessible", description: "Recursion, stack frames, algorithms, and source-backed CS fundamentals." },
  { id: "MATH202", name: "Linear Algebra", subject: "Mathematics", term: "Core", permission: "Accessible", description: "Matrices, eigenvectors, transformations, and proof-linked study notes." },
  { id: "PHIL201", name: "Ethics", subject: "Philosophy", term: "Elective", permission: "Preview", description: "Moral reasoning, critique writing, and verified reading summaries." },
  { id: "STAT230", name: "Probability", subject: "Statistics", term: "Core", permission: "Accessible", description: "Distributions, Bayes theorem, expected value, and worked examples." },
  { id: "AI240", name: "Machine Learning Foundations", subject: "Artificial Intelligence", term: "Never enrolled", permission: "Preview", description: "A public preview Course the User has never joined; only summary metadata is visible." }
];

const recentWikiNotes = [
  { title: "Transformer Architecture", courseId: "CS101", section: "Machine Learning", updated: "2 days ago", citations: ["attention-is-all-you-need.pdf p. 2", "week-08-attention.pptx slide 14"] },
  { title: "Stack Frames", courseId: "CS101", section: "Recursion", updated: "Today", citations: ["week-03-recursion.pdf p. 4"] },
  { title: "Eigenvectors", courseId: "MATH202", section: "Linear Algebra", updated: "Yesterday", citations: ["linear-algebra-week-05.pdf p. 7"] },
  { title: "Bayes Theorem", courseId: "STAT230", section: "Probability", updated: "3 days ago", citations: ["probability-week-04.pdf p. 9"] }
];

const sourceFiles = [
  { id: "week-03-recursion.pdf", courseId: "CS101", kind: "PDF", status: "Indexed" },
  { id: "attention-slides-v2.pptx", courseId: "CS101", kind: "PPTX", status: "Reviewed" },
  { id: "linear-algebra-week-05.pdf", courseId: "MATH202", kind: "PDF", status: "Indexed" },
  { id: "ethics-reading-pack.docx", courseId: "PHIL201", kind: "DOCX", status: "Published notes only" }
];

const ChatEvidence = [
  { question: "Why does recursion need a base case?", answer: "A base case gives recursion a solved stopping point, so calls can return through the stack instead of expanding forever.", citations: ["Stack Frames", "week-03-recursion.pdf p. 4"] },
  { question: "Show the original stack frame slide.", answer: "This mock Accessible Member view can cite the Published Wiki Note but cannot expose the restricted original Source File.", citations: ["Stack Frames"], restricted: true },
  { question: "What will be on the final exam?", answer: "I do not have visible Course evidence for that. The Agent must not answer from model knowledge.", citations: [] },
  { question: "How do I trace a recursive call?", answer: "Start from the base case, then work backward through each stack frame using the values saved at that call.", citations: ["Stack Frames", "week-03-recursion.pdf p. 6"] }
];

const PrivateGroup = [
  { name: "Finals Sprint", linkedCourse: "CS101", members: 6, mode: "Updates", owner: "Narin", joinCode: "FS-204" },
  { name: "Linear Algebra Lab", linkedCourse: "MATH202", members: 4, mode: "Inherited", owner: "Maya", joinCode: "LA-118" },
  { name: "Ethics Reading Circle", linkedCourse: "PHIL201", members: 5, mode: "Clean", owner: "Pim", joinCode: "ER-331" }
];

const futureRoadmap = [
  "Production Chula verification",
  "OCR/vision Enrollment Recognition",
  "multi-Course Private Groups",
  "hybrid vector retrieval",
  "Autonomous Agent publication",
  "Course Export packaging"
];

const menuCollapsedItemLimit = 3;
const menuExpandedItemLimit = 4;

function routeFromKey(routeKey) {
  if (!routeKey) return null;
  const raw = decodeURIComponent(routeKey).trim();
  const id = raw.toLowerCase().replaceAll(" ", "-");
  if (id === "home" || raw.toLowerCase() === "home") return { id: "home", label: "Home" };
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
    wikiView: "landing",
    activeQuestion: 0,
    selectedCourseId: "CS101",
    pinnedCourseIds: ["MATH202", "STAT230"],
    selectedFileId: "week-03-recursion.pdf",
    uploadModalOpen: false,
    selectedUploadFiles: [],
    authSession: null,
    authLoading: true,
    authSetupError: "",
    memberProfile: null,
    courses: [],
    courseEnrollments: [],
    dataLoading: false,
    dataError: "",
    railCollapsed: false,
    menuExpandedSections: { chat: false },
    profileOpen: false,
    settingsOpen: false,
    settingsSection: "account",
    theme: "light",
    welcomePhraseIndex: 0
  };

  try {
    const stored = window.localStorage.getItem(storageKey);
    const parsed = stored ? JSON.parse(stored) : {};
    const { authSession, authLoading, authSetupError, memberProfile, courses, courseEnrollments, dataLoading, dataError, ...persisted } = parsed;
    return { ...fallback, ...persisted, activeRoute: routeFromHash() || persisted.activeRoute || fallback.activeRoute, profileOpen: false, settingsOpen: false };
  } catch (error) {
    return fallback;
  }
}

const state = loadState();
let profileImagePreviewUrl = "";
let profileImageError = "";

function saveState() {
  try {
    const { authSession, authLoading, authSetupError, memberProfile, courses, courseEnrollments, dataLoading, dataError, ...rest } = state;
    const persisted = { ...rest, profileOpen: false, uploadModalOpen: false, selectedUploadFiles: [] };
    window.localStorage.setItem(storageKey, JSON.stringify(persisted));
  } catch (error) {
    return undefined;
  }
}

function applyTheme() {
  const theme = themeOptions.some((option) => option.id === state.theme) ? state.theme : "light";
  document.documentElement.dataset.theme = theme;
  if (document.body) document.body.dataset.theme = theme;
  const shell = document.getElementById("appShell");
  if (shell) shell.dataset.theme = theme;
}

function setTheme(theme) {
  state.theme = themeOptions.some((option) => option.id === theme) ? theme : "light";
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

function memberDisplayName() {
  const raw = state.memberProfile?.display_name || state.authSession?.user?.user_metadata?.full_name || state.authSession?.user?.email || "CSAgent Member";
  return String(raw).split("@")[0] || "CSAgent Member";
}

function profileImageMarkup() {
  const imageUrl = profileImagePreviewUrl || state.memberProfile?.avatar_url || "";
  if (imageUrl) return `<img src="${escapeHtml(imageUrl)}" alt="Profile image">`;
  return `<span aria-hidden="true">${escapeHtml(memberDisplayName().charAt(0) || "C")}</span>`;
}

function handleProfileImageSelection(input) {
  const file = input.files?.[0];
  profileImageError = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    profileImageError = "Choose an image file.";
    renderApp();
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth > 1024 || image.naturalHeight > 1024) {
      URL.revokeObjectURL(objectUrl);
      profileImageError = "Profile images must be 1024 x 1024 or smaller.";
      renderApp();
      return;
    }
    if (profileImagePreviewUrl) URL.revokeObjectURL(profileImagePreviewUrl);
    profileImagePreviewUrl = objectUrl;
    renderApp();
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    profileImageError = "This image could not be opened.";
    renderApp();
  };
  image.src = objectUrl;
}

function rotateWelcomeBackPhrase() {
  state.welcomePhraseIndex = Math.floor(Math.random() * welcomeBackPhrases.length);
  saveState();
}

function courseList() {
  return state.courses.length ? state.courses : [];
}

function selectableCourses() {
  return state.courses.length ? state.courses : enrolledCourses;
}

function platformCourseById(courseId) {
  return platformCourses.find((course) => course.id === courseId) || platformCourses[0];
}

function platformCoursePermissionTone(permission) {
  return permission === "Accessible" ? "green" : "blue";
}

function platformCourseAction(permission) {
  return permission === "Accessible" ? "View" : "Preview";
}

function pinnedCourses() {
  return platformCourses.filter((course) => state.pinnedCourseIds.includes(course.id));
}

function isCoursePinned(courseId) {
  return state.pinnedCourseIds.includes(courseId);
}

function togglePinnedCourse(courseId) {
  state.pinnedCourseIds = isCoursePinned(courseId)
    ? state.pinnedCourseIds.filter((id) => id !== courseId)
    : [...state.pinnedCourseIds, courseId];
  saveState();
  renderApp();
}

function courseAccessTone(access) {
  return access === "Full Access" ? "green" : "blue";
}

function normalizeSupabaseCourses(courses, enrollments) {
  const enrollmentByCourseId = new Map((enrollments || []).map((enrollment) => [enrollment.course_id, enrollment]));
  return (courses || []).map((course) => {
    const enrollment = enrollmentByCourseId.get(course.id);
    return {
      id: course.course_code,
      dbId: course.id,
      name: course.name,
      subject: course.subject,
      notes: course.notes_count || 0,
      sourceFiles: course.source_files_count || 0,
      access: enrollment?.access_level || course.access_label || "Discoverable",
      progress: course.progress || "",
      active: Boolean(enrollment?.is_active)
    };
  });
}

async function loadSupabaseAppData() {
  if (state.authSession?.isTemporaryBypass) {
    state.memberProfile = {
      id: state.authSession.user.id,
      display_name: state.authSession.user.user_metadata?.full_name || "Web Build Member",
      email: state.authSession.user.email,
      role: "Normal User",
      identity_status: "Temporary login bypass",
      chula_verification_status: "Release gate"
    };
    state.courses = enrolledCourses;
    state.courseEnrollments = [];
    state.dataLoading = false;
    state.dataError = "";
    return;
  }
  if (!window.CSAgentAuth?.client || !state.authSession?.user) return;
  state.dataLoading = true;
  state.dataError = "";
  renderApp();

  try {
    const userId = state.authSession.user.id;
    const memberResult = await window.CSAgentAuth.client
      .from("members")
      .select("id, class_space_id, display_name, email, avatar_url, role, identity_status, chula_verification_status")
      .eq("id", userId)
      .single();
    if (memberResult.error) throw memberResult.error;

    const coursesResult = await window.CSAgentAuth.client
      .from("courses")
      .select("id, class_space_id, course_code, name, subject, notes_count, source_files_count, access_label, progress")
      .order("course_code", { ascending: true });
    if (coursesResult.error) throw coursesResult.error;

    const enrollmentsResult = await window.CSAgentAuth.client
      .from("course_enrollments")
      .select("id, member_id, course_id, access_level, is_active")
      .eq("member_id", userId);
    if (enrollmentsResult.error) throw enrollmentsResult.error;

    state.memberProfile = memberResult.data;
    state.courseEnrollments = enrollmentsResult.data || [];
    state.courses = normalizeSupabaseCourses(coursesResult.data || [], state.courseEnrollments);
    if (state.courses.length && !state.courses.some((course) => course.id === state.selectedCourseId)) {
      state.selectedCourseId = state.courses[0].id;
    }
  } catch (error) {
    state.dataError = error.message || "Could not load Supabase app data.";
    state.memberProfile = null;
    state.courses = [];
    state.courseEnrollments = [];
  } finally {
    state.dataLoading = false;
  }
}

function currentCourse() {
  const courses = courseList();
  return courses.find((course) => course.id === state.selectedCourseId) || courses[0] || enrolledCourses[0];
}

function currentSourceFile() {
  return sourceFiles.find((file) => file.id === state.selectedFileId) || sourceFiles[0];
}

function currentWikiNote() {
  return recentWikiNotes.find((note) => note.title === state.activeWikiTitle) || recentWikiNotes[0];
}

function uploadFileParts(fileName) {
  const cleanName = String(fileName || "Untitled file");
  const dotIndex = cleanName.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === cleanName.length - 1) return { name: cleanName, type: "file" };
  return {
    name: cleanName.slice(0, dotIndex),
    type: cleanName.slice(dotIndex).toLowerCase()
  };
}

function filesToUpload(fileList) {
  return Array.from(fileList || []).map((file) => uploadFileParts(file.name));
}

function uploadFileSummary() {
  if (!state.selectedUploadFiles.length) return "No files selected";
  return `${state.selectedUploadFiles.length} file${state.selectedUploadFiles.length === 1 ? "" : "s"} selected`;
}

function setRoute(routeKey) {
  const route = routeFromKey(routeKey) || { id: "home", label: "Home" };
  state.activeRoute = route.label;
  state.profileOpen = false;
  state.settingsOpen = false;
  const nextHash = `#${encodeURIComponent(route.id)}`;
  if (window.location.hash !== nextHash) window.history.replaceState(null, "", nextHash);
  saveState();
  renderApp();
}

function toggleProfileMenu() {
  state.profileOpen = !state.profileOpen;
  renderProfileMenu();
}

function openSettingsOverlay() {
  state.settingsOpen = true;
  if (!settingsSections.some((section) => section.id === state.settingsSection)) state.settingsSection = "account";
  state.profileOpen = false;
  saveState();
  renderApp();
}

function closeSettingsOverlay() {
  state.settingsOpen = false;
  saveState();
  renderApp();
}

function setSettingsSection(sectionId) {
  state.settingsSection = settingsSections.some((section) => section.id === sectionId) ? sectionId : "account";
  saveState();
  renderApp();
}

function toggleSidebar() {
  state.railCollapsed = !state.railCollapsed;
  saveState();
  renderApp();
}

function isMenuSectionExpanded(sectionId) {
  return Boolean(state.menuExpandedSections?.[sectionId]);
}

function menuSectionLimit(sectionId) {
  return isMenuSectionExpanded(sectionId) ? menuExpandedItemLimit : menuCollapsedItemLimit;
}

function menuVisibleItems(items, sectionId) {
  return items.slice(0, menuSectionLimit(sectionId));
}

function menuHasMore(items) {
  return items.length >= 4;
}

function toggleMenuSection(sectionId) {
  state.menuExpandedSections = {
    chat: false,
    ...(state.menuExpandedSections || {}),
    [sectionId]: !isMenuSectionExpanded(sectionId)
  };
  saveState();
  renderApp();
}

function chatMenuItems() {
  return ChatEvidence.map((item, index) => ({
    title: item.question,
    meta: item.restricted ? "Source Non-Disclosure active" : "Course evidence answer",
    index
  }));
}

function renderMenuContext() {
  const chatItems = chatMenuItems();
  const visibleChatItems = menuVisibleItems(chatItems, "chat");
  const visibleWikiNotes = recentWikiNotes.slice(0, menuCollapsedItemLimit);
  return `
    <section class="menu-subsection" aria-label="Recently opened Course Wiki notes">
      <div class="menu-section-head">
        <h3>Recent Wiki</h3>
      </div>
      <div class="menu-section-list">
        ${visibleWikiNotes.length ? visibleWikiNotes.map((note) => `
          <button class="recent-note" type="button" data-wiki-title="${escapeHtml(note.title)}" aria-current="${note.title === state.activeWikiTitle ? "page" : "false"}">
            <strong>${escapeHtml(note.title)}</strong>
          </button>
        `).join("") : `<p class="menu-empty">No recent Wiki</p>`}
      </div>
    </section>
    <section class="menu-subsection" aria-label="Chat">
      <div class="menu-section-head">
        <h3>Chat</h3>
        ${menuHasMore(chatItems) ? `<button class="menu-section-more" type="button" data-toggle-menu-section="chat">${isMenuSectionExpanded("chat") ? "Less" : "More"}</button>` : ""}
      </div>
      <div class="menu-section-list">
        ${visibleChatItems.length ? visibleChatItems.map((item) => `
          <button class="recent-note" type="button" data-menu-chat-question="${item.index}" aria-current="${item.index === state.activeQuestion ? "page" : "false"}">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="muted">${escapeHtml(item.meta)}</span>
          </button>
        `).join("") : `<p class="menu-empty">No recent Chat</p>`}
      </div>
    </section>
  `;
}

function fixedMenuRoutes() {
  return routes.filter((route) => ["course", "wiki"].includes(route.id));
}

function scrollMenuRoutes() {
  const routeIds = ["browse", "private", "agents"];
  return routeIds.map((routeId) => routes.find((route) => route.id === routeId)).filter(Boolean);
}

function renderMenuRouteButtons(routeList) {
  return routeList.map((route) => `
    <button class="menu-route" type="button" data-route="${escapeHtml(route.id)}" aria-current="${route.label === state.activeRoute ? "page" : "false"}" title="${escapeHtml(route.label)}">
      <span class="route-icon">${route.icon}</span>
      <span class="menu-label">${escapeHtml(route.label)}</span>
    </button>
  `).join("");
}

function renderMenu() {
  const menu = document.getElementById("menuBar");
  menu.innerHTML = `
    <div class="brand-row">
      <button class="brand brand-button" type="button" data-route="home" aria-label="Open Home">
        <span class="brand-mark"><img class="brand-logo brand-logo-light" src="./assets/CSAgent-logo-v2-light-transparent.png" alt=""><img class="brand-logo brand-logo-dark" src="./assets/CSAgent-logo-v2-dark-transparent.png" alt=""></span>
        <span><strong>CSAgent</strong><span>Course Wiki</span></span>
      </button>
      <button class="menu-collapse-button" type="button" data-toggle-sidebar aria-label="${state.railCollapsed ? "Expand menu" : "Collapse menu"}">${state.railCollapsed ? `<img class="menu-collapse-logo brand-logo-light" src="./assets/CSAgent-logo-v2-light-transparent.png" alt=""><img class="menu-collapse-logo brand-logo-dark" src="./assets/CSAgent-logo-v2-dark-transparent.png" alt="">` : icons.collapse}</button>
    </div>
    <nav class="menu-nav menu-nav-fixed" aria-label="Primary navigation">
      ${renderMenuRouteButtons(fixedMenuRoutes())}
    </nav>
    <div class="menu-scroll-region">
      <nav class="menu-nav menu-nav-scroll" aria-label="Secondary navigation">
        ${renderMenuRouteButtons(scrollMenuRoutes())}
      </nav>
      <div class="menu-context">${renderMenuContext()}</div>
    </div>
  `;
}

function renderProfileMenu() {
  if (!state.authSession) return;
  const memberName = state.memberProfile ? state.memberProfile.display_name : state.authSession.user?.user_metadata?.full_name || state.authSession.user?.email || "CSAgent Member";
  const memberEmail = state.memberProfile?.email || state.authSession.user?.email || "No email connected";
  const memberRole = state.memberProfile ? state.memberProfile.role : "Normal User";
  const profileButton = document.getElementById("profileButton");
  const profileMenu = document.getElementById("profileMenu");
  profileButton.setAttribute("aria-expanded", String(state.profileOpen));
  profileMenu.hidden = !state.profileOpen;
  profileMenu.innerHTML = `
    <div class="profile-head">
      <div class="profile-avatar">${escapeHtml(memberName.charAt(0) || "C")}</div>
      <div>
        <strong>${escapeHtml(memberName)}</strong>
        <div class="muted">${escapeHtml(memberRole)}</div>
      </div>
    </div>
    <section class="profile-section" aria-label="Account actions">
      <span class="muted">${escapeHtml(memberEmail)}</span>
      <button class="button" type="button" data-open-settings>Settings</button>
    </section>
  `;
}

function renderSettingsSection(section) {
  if (section === "account") {
    return `
      <section class="settings-panel" aria-label="Account">
        <h3>Account</h3>
        <div class="account-login">
          <img class="provider-logo" src="assets/google-logo-transparent.png" alt="Google">
          <div><strong>Google login</strong><span class="muted">${escapeHtml(state.memberProfile?.email || state.authSession?.user?.email || "No email connected")}</span></div>
        </div>
        <button class="button" type="button" data-sign-out>Sign out</button>
      </section>
    `;
  }
  if (section === "profile") {
    return `
      <section class="settings-panel" aria-label="Profile">
        <section class="settings-group" aria-labelledby="profileSettingsHeading">
          <h3 id="profileSettingsHeading">Profile</h3>
          <div class="profile-image-row">
            <div class="profile-image">${profileImageMarkup()}</div>
            <div class="profile-image-controls">
              <button class="button profile-image-upload" type="button" data-profile-image-upload>Upload image</button>
              <input class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" data-profile-image-input>
              <span class="muted">PNG, JPG, or WEBP. 1024 x 1024 max.</span>
              ${profileImageError ? `<span class="field-error" role="alert">${escapeHtml(profileImageError)}</span>` : ""}
            </div>
          </div>
          <div class="profile-detail-list">
            <div class="profile-detail"><span>Username</span><strong>${escapeHtml(memberDisplayName())}</strong></div>
            <div class="profile-detail"><span>Role</span><strong>${escapeHtml(state.memberProfile?.role || "Normal User")}</strong></div>
            <div class="profile-detail"><span>Identity</span><strong>${escapeHtml(state.memberProfile?.identity_status || "Google pilot login")}</strong></div>
            <div class="profile-detail"><span>Chula verification</span><strong>${escapeHtml(state.memberProfile?.chula_verification_status || "Release gate")}</strong></div>
          </div>
        </section>
        <section class="settings-group" aria-labelledby="accessLabelsHeading">
          <h3 id="accessLabelsHeading">Access Labels</h3>
          <div class="access-label-list"><span class="access-label">CS33</span></div>
        </section>
      </section>
    `;
  }
  if (section === "preferences") {
    return `
      <section class="settings-panel" aria-label="Preferences">
        <h3>Preferences</h3>
        <div class="theme-choice-grid">
          ${themeOptions.map((option) => `
            <button class="theme-choice" type="button" data-theme-choice="${escapeHtml(option.id)}" aria-pressed="${option.id === state.theme ? "true" : "false"}">
              <span>${escapeHtml(option.label)}</span>
              <span class="theme-preview">${option.preview.map((color) => `<span class="theme-preview-swatch" style="background:${escapeHtml(color)}"></span>`).join("")}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }
  if (section === "notifications") return `<section class="settings-panel" aria-label="Notifications"><h3>Notifications</h3><div class="settings-row"><span>Course updates</span><strong>On</strong></div></section>`;
  return `<section class="settings-panel" aria-label="More"><h3>More</h3><div class="settings-row"><span>App build</span><strong>Local</strong></div></section>`;
}

function renderSettingsOverlay() {
  if (!state.authSession || !state.settingsOpen) return "";
  const activeSection = settingsSections.some((section) => section.id === state.settingsSection) ? state.settingsSection : "account";
  return `
    <div class="settings-backdrop" role="presentation">
      <section class="settings-overlay" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
        <header class="settings-head">
          <h2 id="settingsTitle">Settings</h2>
          <button class="icon-button" type="button" data-close-settings aria-label="Close settings">x</button>
        </header>
        <div class="settings-body">
          <nav class="settings-nav" aria-label="Settings sections">
            ${settingsSections.map((section) => `<button class="settings-nav-item ${activeSection === section.id ? "active" : ""}" type="button" data-settings-section="${escapeHtml(section.id)}" aria-current="${activeSection === section.id ? "page" : "false"}">${escapeHtml(section.label)}</button>`).join("")}
          </nav>
          <div class="settings-panels">${renderSettingsSection(activeSection)}</div>
        </div>
      </section>
    </div>
  `;
}

function renderLogin() {
  return `
    <section class="login-view" aria-label="Sign in">
      <article class="login-card">
        <div class="login-brand">
          <span class="brand-mark"><img class="brand-logo brand-logo-light" src="./assets/CSAgent-logo-v2-light-transparent.png" alt=""><img class="brand-logo brand-logo-dark" src="./assets/CSAgent-logo-v2-dark-transparent.png" alt=""></span>
          <span><strong>CSAgent</strong><span>Course Wiki</span></span>
        </div>
        <h1>Sign in to your Course Wiki workspace.</h1>
        <p class="muted">${state.authLoading ? "Checking sign-in status..." : "Use Google login to enter CSAgent through Supabase Auth."}</p>
        ${state.authSetupError ? `<div class="identity-status danger"><strong>Setup required</strong><p>${escapeHtml(state.authSetupError)}</p></div>` : ""}
        <button class="login-button" type="button" data-login-google ${state.authLoading || state.authSetupError ? "disabled" : ""}>
          <span class="login-provider-mark" aria-hidden="true">G</span>
          <span>Continue with Google</span>
        </button>
        <div class="identity-status">
          <strong>Identity boundary</strong>
          <p>Verified Chula email is required before the all-CS release. The private pilot does not verify Student Identifier ownership yet.</p>
        </div>
      </article>
    </section>
  `;
}

function renderPageHeader(title, description, action = "") {
  const phrase = welcomeBackPhrases[state.welcomePhraseIndex % welcomeBackPhrases.length];
  return `
    <header class="page-header">
      <div class="page-header-copy">
        <h1>${title}</h1>
        <p class="muted">${description} <span class="page-header-phrase">${escapeHtml(phrase)}</span></p>
      </div>
      ${action}
    </header>
  `;
}

function renderHome() {
  const courses = state.courses;
  return `
    <section class="view home-view" aria-label="Home">
      ${renderPageHeader(`Welcome Back ${escapeHtml(memberDisplayName())}.`, "Your study space is ready.")}

      <section class="panel active-subjects" aria-label="Active subjects">
        <div class="section-head">
          <h2>Active Subjects</h2>
          <button class="button" type="button" data-route="course">View all Courses</button>
        </div>
        ${state.dataLoading ? `<p class="muted">Loading Courses from Supabase...</p>` : ""}
        ${state.dataError ? `<p class="muted">Could not load Courses: ${escapeHtml(state.dataError)}</p>` : ""}
        ${!state.dataLoading && !state.dataError && !courses.length ? `<p class="muted">No enrolled Courses yet.</p>` : ""}
        ${courses.length ? `<div class="subject-grid">
          ${state.courses.map((course) => `
            <article class="card subject-card">
              ${badge(course.active ? "Active" : course.access, course.active ? "green" : courseAccessTone(course.access))}
              <h3>${escapeHtml(course.id)}</h3>
              <p>${escapeHtml(course.name)}</p>
              <span class="source-pill">${course.notes} Notes</span>
              <button class="button" type="button" data-select-course="${escapeHtml(course.id)}" data-route="wiki" data-wiki-view="landing">Open Wiki</button>
            </article>
          `).join("")}
        </div>` : ""}
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
  const courses = state.courses;
  const selectedCourse = platformCourseById(state.selectedCourseId);
  return `
    <section class="view course-view" aria-label="Course">
      ${renderPageHeader(`${escapeHtml(selectedCourse.id)} - ${escapeHtml(selectedCourse.name)}`, escapeHtml(selectedCourse.description), '<button class="button primary" type="button" data-route="browse">Browse Course</button>')}
      ${state.dataLoading ? `<article class="panel"><p class="muted">Loading Courses from Supabase...</p></article>` : ""}
      ${state.dataError ? `<article class="panel"><p class="muted">Could not load Courses: ${escapeHtml(state.dataError)}</p></article>` : ""}
      ${!state.dataLoading && !state.dataError && !courses.length ? `<article class="panel"><p class="muted">No Courses available.</p></article>` : ""}
      ${courses.length ? `<section class="course-grid">
        ${state.courses.map((course) => `
          <article class="card">
            <div class="card-row">${badge(course.access, courseAccessTone(course.access))}<span class="muted">${course.sourceFiles} Source Files</span></div>
            <h3>${escapeHtml(course.id)} - ${escapeHtml(course.name)}</h3>
            <p>${escapeHtml(course.subject)}</p>
            <p class="muted">${escapeHtml(course.progress)}</p>
            <button class="button primary" type="button" data-select-course="${escapeHtml(course.id)}" data-route="wiki" data-wiki-view="landing">To Wiki</button>
          </article>
        `).join("")}
      </section>` : ""}
      <article class="panel">
        <div class="section-head"><h2>Future Scope Notes</h2></div>
        <p class="muted">${futureRoadmap.map(escapeHtml).join(" | ")}</p>
      </article>
    </section>
  `;
}

function renderBrowse() {
  const pinned = pinnedCourses();
  return `
    <section class="view browse-view" aria-label="Browse Courses">
      <div class="browse-main">
        ${renderPageHeader("Browse platform Courses.", "This mock catalog shows every Course currently visible on the platform. Permission tags decide whether the User can view the Course or only preview its public summary.")}
        <section class="browse-list" aria-label="Platform Course list">
          ${platformCourses.map((course) => `
            <article class="card browse-course-card">
              <button class="pin-button ${isCoursePinned(course.id) ? "is-pinned" : ""}" type="button" data-toggle-pin="${escapeHtml(course.id)}" aria-label="${isCoursePinned(course.id) ? "Unpin" : "Pin"} ${escapeHtml(course.id)}">${icons.pin}</button>
              <div class="browse-course-copy">
                <div class="card-row">
                  ${badge(course.permission, platformCoursePermissionTone(course.permission))}
                  <span class="muted">${escapeHtml(course.term)}</span>
                </div>
                <h3>${escapeHtml(course.id)} - ${escapeHtml(course.name)}</h3>
                <p>${escapeHtml(course.subject)}</p>
                <p class="muted">${escapeHtml(course.description)}</p>
              </div>
              <button class="button ${course.permission === "Accessible" ? "primary" : ""}" type="button" data-select-course="${escapeHtml(course.id)}" data-route="course">${platformCourseAction(course.permission)}</button>
            </article>
          `).join("")}
        </section>
      </div>
      <aside class="browse-toolbar" aria-label="Pinned Courses">
        <h2>Pinned Course</h2>
        <div class="pinned-course-list">
          ${pinned.length ? pinned.map((course) => `
            <button class="pinned-course" type="button" data-select-course="${escapeHtml(course.id)}" data-route="course">
              <span class="pinned-course-icon ${platformCoursePermissionTone(course.permission)}">${course.permission === "Accessible" ? icons.unlock : icons.eye}</span>
              <span>
                <strong>${escapeHtml(course.id)}</strong>
                <span class="muted">${escapeHtml(course.permission)}</span>
              </span>
            </button>
          `).join("") : `<p class="muted">Pin Courses from the list.</p>`}
        </div>
      </aside>
    </section>
  `;
}

function renderWikiLanding() {
  const course = currentCourse();
  return `
    <section class="wiki-page wiki-landing" aria-label="Course Wiki landing">
      <div class="wiki-article-scroll">
        <article class="wiki-article">
          <header class="wiki-page-header page-header">
            <div class="page-header-copy">
              <h1>About ${escapeHtml(course.name)}</h1>
              <p class="muted">Course context, source coverage, and published notes in one place.</p>
            </div>
          </header>
          <div class="wiki-tools">
            <div>${badge(course.access, course.access === "Full Access" ? "green" : "blue")} <span class="muted">${escapeHtml(course.progress)}</span></div>
          </div>
          <div class="wiki-readable">
            <p class="wiki-lead">This is the Course landing page before the wiki content. It gives the course context first, then lets the User jump to uploads, the map, source files, or published wiki notes.</p>
            <section class="wiki-section">
              <h2>Recent Wiki Notes</h2>
              <div class="compact-list">
                ${recentWikiNotes.map((item) => `
                  <button class="recent-note" type="button" data-wiki-title="${escapeHtml(item.title)}" data-wiki-view="article">
                    <strong>${escapeHtml(item.title)}</strong>
                    <span class="muted">${escapeHtml(item.courseId)} - ${escapeHtml(item.section)} - ${escapeHtml(item.updated)}</span>
                  </button>
                `).join("")}
              </div>
            </section>
          </div>
        </article>
      </div>
      <aside class="wiki-context" aria-label="Course wiki actions">
        <section class="wiki-action-stack" aria-label="Course wiki actions">
          <button class="button primary" type="button" data-open-upload-modal>Upload Source</button>
          <button class="button" type="button">Graph View</button>
          <div class="wiki-action-spacer" aria-hidden="true"></div>
          <button class="button" type="button">To Source</button>
        </section>
      </aside>
    </section>
  `;
}

function renderUploadModal() {
  if (!state.uploadModalOpen) return "";
  const course = currentCourse();
  const courses = selectableCourses();
  return `
    <div class="upload-backdrop" role="presentation">
      <section class="upload-modal" role="dialog" aria-modal="true" aria-labelledby="uploadTitle">
        <header class="upload-modal-head">
          <div>
            <h2 id="uploadTitle">Add to Knowledge Base</h2>
            <p class="muted">Upload documents so CSAgent can extract and structure Course evidence.</p>
          </div>
          <button class="icon-button" type="button" data-close-upload-modal aria-label="Close upload dialog">x</button>
        </header>

        <div class="upload-modal-body">
          <div class="upload-body-grid">
            <div class="upload-main">
              <div class="upload-dropzone" data-upload-dropzone>
                <div class="upload-icon" aria-hidden="true">
                  <svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 16V8"></path><path d="m8 12 4-4 4 4"></path><path d="M20 16.5a4.5 4.5 0 0 0-6.4-4.1A5.5 5.5 0 0 0 3 14.5 4.5 4.5 0 0 0 7.5 19H19a3 3 0 0 0 1-5.8"></path></svg>
                </div>
                <h3>Drag and drop files</h3>
                <p class="muted">Drop PDFs, DOCX, or handwritten images here.</p>
                <button class="button" type="button" data-browse-upload>Browse Files</button>
                <input class="sr-only" type="file" data-upload-input accept=".pdf,.docx,.png,.jpg,.jpeg" multiple>
                <p class="upload-file-summary">${escapeHtml(uploadFileSummary())}</p>
              </div>

              <div class="upload-form-grid">
                <label>
                  <span>Subject Context</span>
                  <select>
                    <option>${escapeHtml(course.id)} - ${escapeHtml(course.name)}</option>
                    ${courses.filter((item) => item.id !== course.id).map((item) => `<option>${escapeHtml(item.id)} - ${escapeHtml(item.name)}</option>`).join("")}
                  </select>
                </label>
                <label>
                  <span>Temporal Marker</span>
                  <select>
                    <option>Select unit/week...</option>
                    <option>Week 03</option>
                    <option>Midterm Review</option>
                    <option>Final Review</option>
                  </select>
                </label>
              </div>

              <label class="upload-description">
                <span>Brief Description</span>
                <textarea rows="2" placeholder="e.g., Lecture slides covering recursive stack frames..."></textarea>
              </label>
            </div>

            <aside class="upload-file-sidebar" aria-label="Files to upload">
              <h3>Files to upload</h3>
              <div class="upload-file-list">
                ${state.selectedUploadFiles.length ? state.selectedUploadFiles.map((file) => `
                  <div class="upload-file-row">
                    <span class="upload-file-name">${escapeHtml(file.name)}</span>
                    <span class="upload-file-type">${escapeHtml(file.type)}</span>
                  </div>
                `).join("") : `<p class="muted">Selected files will appear here.</p>`}
              </div>
            </aside>
          </div>
        </div>

        <footer class="upload-modal-foot">
          <button class="button" type="button" data-close-upload-modal>Cancel</button>
          <button class="button primary" type="button">Start Processing</button>
        </footer>
      </section>
      <p class="upload-support-note">Supported formats: .pdf, .docx, .png, .jpg (Max 50MB)</p>
    </div>
  `;
}

function renderWikiArticle() {
  const note = currentWikiNote();
  return `
    <section class="wiki-page" aria-label="Course Wiki">
      <div class="wiki-article-scroll">
        <article class="wiki-article">
          <header class="wiki-page-header page-header">
            <div class="page-header-copy">
              <h1>${escapeHtml(note.title)}</h1>
              <p class="muted">A focused Course Wiki note with evidence, context, and review-ready structure.</p>
            </div>
          </header>
          <div class="wiki-tools">
            <div>${badge("Verified", "green")} <span class="muted">Last edited ${escapeHtml(note.updated)}</span></div>
            <div class="wiki-action-group"><button class="icon-button wiki-icon-button" type="button" aria-label="Edit note">${icons.edit}</button><button class="icon-button wiki-icon-button" type="button" aria-label="Share note">${icons.share}</button></div>
          </div>
          <div class="wiki-readable">
            <p class="wiki-lead">The Transformer is a deep learning architecture built around attention. This mock Course Wiki page keeps the center article independently scrollable while the right reference section remains fixed.</p>
            <section class="wiki-section" aria-labelledby="self-attention-mechanism">
              <h2 id="self-attention-mechanism">Self-Attention Mechanism</h2>
              <p>Self-attention lets each token weigh other tokens in the sequence before producing a contextual representation. CSAgent keeps claims tied to Course evidence and exposes citations when the User has access.</p>
              <div class="insight"><strong>Key Insight</strong><span>Unlike recurrent models, attention can compare positions across the sequence in parallel while preserving citation-backed explanations.</span></div>
            </section>
            <section class="wiki-section" aria-labelledby="mathematical-formulation">
              <h2 id="mathematical-formulation">Mathematical Formulation</h2>
              <p>The attention output maps a query and key-value pairs to a weighted representation. Course citations stay attached to the note so the Agent can answer from evidence only.</p>
              <pre class="code-block">Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V</pre>
            </section>
            <section class="wiki-section" aria-labelledby="implementation-notes">
              <h2 id="implementation-notes">Implementation Notes</h2>
              <p>For the first real website pass, this stays as a mock article. Later integration can replace this renderer with PublishedWikiNote data without changing the shell.</p>
            </section>
          </div>
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

function renderWiki() {
  return state.wikiView === "article" ? renderWikiArticle() : renderWikiLanding();
}

function renderAgents() {
  const selectedCourse = currentCourse();
  const selectedFile = currentSourceFile();
  const active = ChatEvidence[state.activeQuestion] || ChatEvidence[0];
  return `
    <section class="view agents-view agent-chat" aria-label="Agents">
      ${renderPageHeader("Ask with Course evidence selected.", "Agent chat mockups answer from ChatEvidence only. Use the plus controls to choose a Course and Source File context.")}
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
            ${selectableCourses().map((course) => `<button class="context-button" type="button" data-select-course="${escapeHtml(course.id)}" aria-pressed="${course.id === selectedCourse.id ? "true" : "false"}">${escapeHtml(course.id)}</button>`).join("")}
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
      ${renderPageHeader("Your private study groups.", "PrivateGroup cards stay tied to one official Course in this first normal User UI. Cross-Course behavior is shown only as future scope.")}
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
    Browse: renderBrowse,
    Wiki: renderWiki,
    Agents: renderAgents,
    Group: renderPrivate
  };
  return renderers[state.activeRoute]();
}

function bindInteractions() {
  document.querySelectorAll("[data-login-google]").forEach((button) => {
    button.onclick = async () => {
      await window.CSAgentAuth?.signInWithGoogle();
      state.profileOpen = false;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-toggle-sidebar]").forEach((button) => {
    button.onclick = () => {
      toggleSidebar();
    };
  });

  document.querySelectorAll("button[data-route]").forEach((button) => {
    button.onclick = () => {
      if (button.dataset.selectCourse) state.selectedCourseId = button.dataset.selectCourse;
      if (button.dataset.wikiView) state.wikiView = button.dataset.wikiView;
      setRoute(button.dataset.route);
    };
  });

  document.querySelectorAll("[data-toggle-pin]").forEach((button) => {
    button.onclick = () => togglePinnedCourse(button.dataset.togglePin);
  });

  document.querySelectorAll("[data-toggle-menu-section]").forEach((button) => {
    button.onclick = () => toggleMenuSection(button.dataset.toggleMenuSection);
  });

  document.querySelectorAll("[data-menu-chat-question]").forEach((button) => {
    button.onclick = () => {
      state.activeQuestion = Number(button.dataset.menuChatQuestion);
      setRoute("agents");
    };
  });

  document.querySelectorAll("[data-wiki-title]").forEach((button) => {
    button.onclick = () => {
      state.activeWikiTitle = button.dataset.wikiTitle;
      state.wikiView = "article";
      setRoute("wiki");
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
      const courses = selectableCourses();
      const currentIndex = courses.findIndex((course) => course.id === state.selectedCourseId);
      const next = courses[(currentIndex + 1) % courses.length];
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

  document.querySelectorAll("[data-open-upload-modal]").forEach((button) => {
    button.onclick = () => {
      state.uploadModalOpen = true;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-close-upload-modal]").forEach((button) => {
    button.onclick = () => {
      state.uploadModalOpen = false;
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll("[data-close-settings]").forEach((button) => {
    button.onclick = () => {
      closeSettingsOverlay();
    };
  });

  document.querySelectorAll("[data-settings-section]").forEach((button) => {
    button.onclick = () => {
      setSettingsSection(button.dataset.settingsSection);
    };
  });

  document.querySelectorAll("[data-profile-image-upload]").forEach((button) => {
    button.onclick = () => {
      document.querySelector("[data-profile-image-input]")?.click();
    };
  });

  document.querySelectorAll("[data-profile-image-input]").forEach((input) => {
    input.onchange = () => handleProfileImageSelection(input);
  });

  document.querySelectorAll("[data-browse-upload]").forEach((button) => {
    button.onclick = () => {
      const input = document.querySelector("[data-upload-input]");
      input?.click();
    };
  });

  document.querySelectorAll("[data-upload-input]").forEach((input) => {
    input.onchange = () => {
      state.selectedUploadFiles = filesToUpload(input.files);
      saveState();
      renderApp();
    };
  });

  document.querySelectorAll(".upload-modal select, .upload-modal textarea").forEach((control) => {
    control.onpointerdown = (event) => event.stopPropagation();
    control.onclick = (event) => event.stopPropagation();
  });

  document.querySelectorAll("[data-upload-dropzone]").forEach((dropzone) => {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragging");
        if (event.type === "drop") {
          state.selectedUploadFiles = filesToUpload(event.dataTransfer?.files);
          saveState();
          renderApp();
        }
      });
    });
  });

  document.querySelectorAll("[data-floating-agent]").forEach((button) => {
    button.onclick = () => setRoute("agents");
  });

  document.querySelectorAll("[data-sign-out]").forEach((button) => {
    button.onclick = async () => {
      await window.CSAgentAuth?.signOut();
      state.authSession = null;
      state.memberProfile = null;
      state.courses = [];
      state.courseEnrollments = [];
      state.profileOpen = false;
      state.settingsOpen = false;
      saveState();
      renderApp();
    };
  });
}

function renderApp() {
  const hashRoute = routeFromHash();
  if (hashRoute && hashRoute !== state.activeRoute) state.activeRoute = hashRoute;
  if (!routes.some((route) => route.label === state.activeRoute)) state.activeRoute = "Home";
  const shell = document.getElementById("appShell");
  applyTheme();
  if (state.authLoading || !state.authSession) {
    shell.dataset.auth = "signed-out";
    document.body.dataset.auth = "signed-out";
    document.getElementById("menuBar").innerHTML = "";
    document.getElementById("content").innerHTML = renderLogin();
    bindInteractions();
    return;
  }
  shell.dataset.auth = "signed-in";
  document.body.dataset.auth = "signed-in";
  shell.dataset.menu = state.railCollapsed ? "collapsed" : "expanded";
  shell.dataset.route = state.activeRoute.toLowerCase();
  renderMenu();
  document.getElementById("content").innerHTML = renderActiveRoute() + renderUploadModal() + renderSettingsOverlay();
  renderProfileMenu();
  bindInteractions();
}

async function initializeAuth() {
  const result = await window.CSAgentAuth?.getSession();
  state.authSession = result?.session || null;
  state.authSetupError = result?.setupError || result?.error?.message || "";
  state.authLoading = false;
  if (state.authSession) {
    rotateWelcomeBackPhrase();
    await loadSupabaseAppData();
  }
  renderApp();

  window.CSAgentAuth?.onAuthChange(async (session) => {
    state.authSession = session;
    state.profileOpen = false;
    if (session) {
      rotateWelcomeBackPhrase();
      await loadSupabaseAppData();
    } else {
      state.memberProfile = null;
      state.courses = [];
      state.courseEnrollments = [];
    }
    renderApp();
  });
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  if (!target) return;
  const settingsButton = target.closest("[data-open-settings]");
  if (settingsButton) {
    openSettingsOverlay();
    return;
  }
  const themeChoice = target.closest("[data-theme-choice]");
  if (themeChoice) {
    setTheme(themeChoice.dataset.themeChoice);
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

window.addEventListener("hashchange", renderApp);
renderApp();
initializeAuth();
