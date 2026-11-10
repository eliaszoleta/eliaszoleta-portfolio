/**
 * In-page live editor. Lets the site owner click the pencil button,
 * paste a GitHub token once, edit any [data-edit] text directly on
 * the page, and save straight back to index.html on GitHub -- which
 * triggers a normal Vercel redeploy. No backend, no server secrets:
 * the token lives only in this browser's localStorage and talks
 * directly to api.github.com.
 */
(function () {
  "use strict";

  const OWNER = "eliaszoleta";
  const REPO = "eliaszoleta-portfolio";
  const BRANCH = "main";
  const FILE_PATH = "index.html";
  const TOKEN_KEY = "ez_portfolio_gh_token";
  const API_BASE = "https://api.github.com";

  let editMode = false;
  let originalSnapshots = new Map();

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }
  function setToken(t) {
    localStorage.setItem(TOKEN_KEY, t);
  }
  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  /* ---------- UI scaffolding ---------- */

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.id = "siteEditTrigger";
  trigger.setAttribute("aria-label", "Edit page content");
  trigger.innerHTML = '<i class="bi bi-pencil-fill"></i>';
  document.body.appendChild(trigger);

  const toolbar = document.createElement("div");
  toolbar.id = "siteEditToolbar";
  toolbar.innerHTML = `
    <div class="set-row">
      <span class="set-label"><i class="bi bi-pencil-fill"></i> Edit mode &mdash; click any underlined text to edit it</span>
      <button type="button" class="set-btn set-save" id="siteEditSave">Save Changes</button>
      <button type="button" class="set-btn set-discard" id="siteEditDiscard">Discard</button>
      <button type="button" class="set-btn set-exit" id="siteEditExit">Exit</button>
      <button type="button" class="set-link" id="siteEditForget">Forget token</button>
    </div>
    <div class="set-status" id="siteEditStatus"></div>
  `;
  document.body.appendChild(toolbar);

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "siteEditModalOverlay";
  modalOverlay.innerHTML = `
    <div id="siteEditModal">
      <h3>Connect your GitHub token</h3>
      <p>Paste a GitHub personal access token with write access to just the
      <code>${OWNER}/${REPO}</code> repo. It is saved only in this browser and is
      sent directly to GitHub &mdash; never through any other server.</p>
      <ol>
        <li>Go to <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">github.com/settings/personal-access-tokens/new</a></li>
        <li>Under "Repository access", choose "Only select repositories" and pick <strong>${REPO}</strong></li>
        <li>Under "Permissions" &rarr; "Repository permissions", set <strong>Contents</strong> to <strong>Read and write</strong></li>
        <li>Generate the token and paste it below</li>
      </ol>
      <input type="password" id="siteEditTokenInput" placeholder="github_pat_...">
      <div class="set-modal-error" id="siteEditTokenError"></div>
      <div class="set-modal-actions">
        <button type="button" class="set-btn set-save" id="siteEditTokenSave">Connect</button>
        <button type="button" class="set-btn set-exit" id="siteEditTokenCancel">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const statusEl = toolbar.querySelector("#siteEditStatus");

  function setStatus(text, kind) {
    statusEl.textContent = text || "";
    statusEl.className = "set-status" + (kind ? " " + kind : "");
  }

  /* ---------- Token modal ---------- */

  function showTokenModal() {
    modalOverlay.classList.add("active");
    document.getElementById("siteEditTokenError").textContent = "";
    document.getElementById("siteEditTokenInput").value = "";
    document.getElementById("siteEditTokenInput").focus();
  }
  function hideTokenModal() {
    modalOverlay.classList.remove("active");
  }

  document.getElementById("siteEditTokenCancel").addEventListener("click", hideTokenModal);

  document.getElementById("siteEditTokenSave").addEventListener("click", async () => {
    const input = document.getElementById("siteEditTokenInput");
    const errEl = document.getElementById("siteEditTokenError");
    const token = input.value.trim();
    if (!token) {
      errEl.textContent = "Paste a token first.";
      return;
    }
    errEl.textContent = "Checking token...";
    const ok = await verifyToken(token);
    if (!ok.valid) {
      errEl.textContent = ok.message;
      return;
    }
    setToken(token);
    hideTokenModal();
    enterEditMode();
  });

  async function verifyToken(token) {
    try {
      const res = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}`, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }
      });
      if (res.status === 401) return { valid: false, message: "That token was rejected (invalid or expired)." };
      if (res.status === 403) return { valid: false, message: "That token doesn't have access to this repo." };
      if (res.status === 404) return { valid: false, message: "Token can't see this repo. Check repository access in the token settings." };
      if (!res.ok) return { valid: false, message: "Unexpected error checking the token (" + res.status + ")." };
      const data = await res.json();
      if (!data.permissions || !data.permissions.push) {
        return {
          valid: false,
          message:
            "Your GitHub account has write access, but this check can't fully confirm the TOKEN itself was granted it. " +
            "Make sure the token's Contents permission is set to Read and write, then try again."
        };
      }
      // Note: this only confirms you (the account) can push to the repo --
      // it can't fully confirm this specific fine-grained token's own
      // Contents permission. If Save still fails with a permission error,
      // the token itself needs Contents: Read and write.
      return { valid: true };
    } catch (e) {
      return { valid: false, message: "Network error reaching GitHub. Check your connection and try again." };
    }
  }

  /* ---------- Edit mode toggling ---------- */

  trigger.addEventListener("click", async () => {
    if (editMode) {
      exitEditMode(true);
      return;
    }
    const token = getToken();
    if (!token) {
      showTokenModal();
      return;
    }
    enterEditMode();
  });

  function enterEditMode() {
    editMode = true;
    document.body.classList.add("site-edit-mode");
    toolbar.classList.add("active");
    setStatus("");
    originalSnapshots = new Map();
    document.querySelectorAll("[data-edit]").forEach((el) => {
      originalSnapshots.set(el.getAttribute("data-edit"), el.innerHTML);
      el.setAttribute("contenteditable", "true");
    });
    document.addEventListener("click", blockLinksWhileEditing, true);
  }

  function exitEditMode(confirmIfDirty) {
    if (confirmIfDirty && isDirty()) {
      const ok = window.confirm("You have unsaved changes. Exit without saving?");
      if (!ok) return;
    }
    editMode = false;
    document.body.classList.remove("site-edit-mode");
    toolbar.classList.remove("active");
    document.querySelectorAll("[data-edit]").forEach((el) => {
      el.removeAttribute("contenteditable");
    });
    document.removeEventListener("click", blockLinksWhileEditing, true);
  }

  function blockLinksWhileEditing(e) {
    const a = e.target.closest("a");
    if (a && editMode) e.preventDefault();
  }

  function isDirty() {
    let dirty = false;
    document.querySelectorAll("[data-edit]").forEach((el) => {
      const id = el.getAttribute("data-edit");
      if (originalSnapshots.get(id) !== el.innerHTML) dirty = true;
    });
    return dirty;
  }

  document.getElementById("siteEditDiscard").addEventListener("click", () => {
    document.querySelectorAll("[data-edit]").forEach((el) => {
      const id = el.getAttribute("data-edit");
      if (originalSnapshots.has(id)) el.innerHTML = originalSnapshots.get(id);
    });
    setStatus("Reverted to last saved version.", "ok");
  });

  document.getElementById("siteEditExit").addEventListener("click", () => exitEditMode(true));

  document.getElementById("siteEditForget").addEventListener("click", () => {
    const ok = window.confirm("Forget the saved GitHub token on this device?");
    if (!ok) return;
    clearToken();
    exitEditMode(false);
    setStatus("");
  });

  /* ---------- Raw-HTML patch helpers ---------- */

  function findMatch(html, needle, fromIndex) {
    return html.indexOf(needle, fromIndex || 0);
  }

  function replaceElementContent(html, dataEditId, newInnerHTML) {
    const marker = `data-edit="${dataEditId}"`;
    const markerPos = findMatch(html, marker);
    if (markerPos === -1) {
      return { html, found: false };
    }
    // Walk backward to the start of this element's opening tag ("<tagname").
    let tagStart = html.lastIndexOf("<", markerPos);
    if (tagStart === -1) return { html, found: false };
    const tagNameMatch = /^<([a-zA-Z0-9]+)/.exec(html.slice(tagStart));
    if (!tagNameMatch) return { html, found: false };
    const tagName = tagNameMatch[1];

    // End of the opening tag.
    const openTagEnd = html.indexOf(">", markerPos);
    if (openTagEnd === -1) return { html, found: false };
    const contentStart = openTagEnd + 1;

    // Depth-aware scan for the matching closing tag.
    const openRe = new RegExp("<" + tagName + "(\\s|>)", "gi");
    const closeRe = new RegExp("</" + tagName + "\\s*>", "gi");
    openRe.lastIndex = contentStart;
    closeRe.lastIndex = contentStart;
    let depth = 1;
    let searchPos = contentStart;
    let contentEnd = -1;
    while (depth > 0) {
      openRe.lastIndex = searchPos;
      closeRe.lastIndex = searchPos;
      const nextOpen = openRe.exec(html);
      const nextClose = closeRe.exec(html);
      if (!nextClose) break;
      if (nextOpen && nextOpen.index < nextClose.index) {
        depth += 1;
        searchPos = nextOpen.index + nextOpen[0].length;
      } else {
        depth -= 1;
        if (depth === 0) {
          contentEnd = nextClose.index;
        }
        searchPos = nextClose.index + nextClose[0].length;
      }
    }
    if (contentEnd === -1) return { html, found: false };

    const patched = html.slice(0, contentStart) + newInnerHTML + html.slice(contentEnd);
    return { html: patched, found: true };
  }

  /* ---------- Base64 helpers (UTF-8 safe) ---------- */

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }
  function base64ToUtf8(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ---------- Save ---------- */

  document.getElementById("siteEditSave").addEventListener("click", async () => {
    const token = getToken();
    if (!token) {
      showTokenModal();
      return;
    }
    const saveBtn = document.getElementById("siteEditSave");
    saveBtn.disabled = true;
    setStatus("Saving...", "pending");

    try {
      const getRes = await fetch(
        `${API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
        { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" } }
      );
      if (!getRes.ok) {
        setStatus(await describeError(getRes, "fetching the live file"), "error");
        saveBtn.disabled = false;
        return;
      }
      const fileData = await getRes.json();
      let html = base64ToUtf8(fileData.content.replace(/\n/g, ""));

      const changed = [];
      document.querySelectorAll("[data-edit]").forEach((el) => {
        const id = el.getAttribute("data-edit");
        const result = replaceElementContent(html, id, el.innerHTML);
        if (result.found) {
          if (originalSnapshots.get(id) !== el.innerHTML) changed.push(id);
          html = result.html;
        }
      });

      if (changed.length === 0) {
        setStatus("No changes to save.", "ok");
        saveBtn.disabled = false;
        return;
      }

      const putRes = await fetch(`${API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Edit via live site editor (" + changed.length + " field" + (changed.length === 1 ? "" : "s") + ")",
          content: utf8ToBase64(html),
          sha: fileData.sha,
          branch: BRANCH
        })
      });

      if (!putRes.ok) {
        setStatus(await describeError(putRes, "saving"), "error");
        saveBtn.disabled = false;
        return;
      }

      document.querySelectorAll("[data-edit]").forEach((el) => {
        originalSnapshots.set(el.getAttribute("data-edit"), el.innerHTML);
      });
      setStatus("Saved! Vercel is redeploying — live in about a minute.", "ok");
    } catch (e) {
      setStatus("Network error while saving. Check your connection and try again.", "error");
    } finally {
      saveBtn.disabled = false;
    }
  });

  async function describeError(res, action) {
    const status = res.status;
    let ghMessage = "";
    try {
      const body = await res.json();
      if (body && body.message) ghMessage = body.message;
    } catch (e) {
      /* response had no JSON body */
    }
    const suffix = ghMessage ? ' GitHub said: "' + ghMessage + '"' : "";

    if (status === 401) return "Token rejected while " + action + ". It may have expired." + suffix;
    if (status === 403) {
      return (
        "GitHub blocked the write (403) while " +
        action +
        ". This almost always means the token's Contents permission isn't set " +
        "to Read and write -- go to github.com/settings/tokens, open this token, and check " +
        "(or re-grant) Contents: Read and write for " +
        OWNER +
        "/" +
        REPO +
        "." +
        suffix
      );
    }
    if (status === 409) return "The file changed on GitHub since you loaded this page. Reload and try again." + suffix;
    if (status === 422) return "GitHub rejected the request (422). Try reloading the page." + suffix;
    return "Error " + status + " while " + action + "." + suffix;
  }
})();
