/*
 * ============================================================================
 *  multiselect.js  —  Lightweight, dependency-free multi-select component
 * ============================================================================
 *  Renders a searchable checkbox dropdown into a container element.
 *
 *  Usage:
 *    const ms = createMultiSelect(containerEl, {
 *      placeholder: "Select...",
 *      options: ["A", "B"],
 *      onChange: (values) => { ... }
 *    });
 *    ms.setOptions([...]);   // replace available options
 *    ms.setValues([...]);    // set selected values
 *    ms.getValues();         // -> array of selected strings
 * ============================================================================
 */

function createMultiSelect(container, opts = {}) {
  const state = {
    options: opts.options ? [...opts.options] : [],
    selected: new Set(),
    placeholder: opts.placeholder || "Select...",
    onChange: opts.onChange || function () {},
    open: false,
  };

  // Build DOM
  container.classList.add("ms");
  container.innerHTML = `
    <div class="ms-control" tabindex="0">
      <div class="ms-tags"></div>
      <span class="ms-arrow">▾</span>
    </div>
    <div class="ms-panel" hidden>
      <input type="text" class="ms-search" placeholder="Search..." />
      <div class="ms-options"></div>
    </div>
  `;

  const controlEl = container.querySelector(".ms-control");
  const tagsEl = container.querySelector(".ms-tags");
  const panelEl = container.querySelector(".ms-panel");
  const searchEl = container.querySelector(".ms-search");
  const optionsEl = container.querySelector(".ms-options");

  function renderTags() {
    tagsEl.innerHTML = "";
    if (state.selected.size === 0) {
      const ph = document.createElement("span");
      ph.className = "ms-placeholder";
      ph.textContent = state.placeholder;
      tagsEl.appendChild(ph);
      return;
    }
    state.selected.forEach((val) => {
      const tag = document.createElement("span");
      tag.className = "ms-tag";
      tag.innerHTML = `<span>${escapeHtml(val)}</span><button type="button" class="ms-tag-x" aria-label="Remove">×</button>`;
      tag.querySelector(".ms-tag-x").addEventListener("click", (e) => {
        e.stopPropagation();
        state.selected.delete(val);
        refresh();
      });
      tagsEl.appendChild(tag);
    });
  }

  function renderOptions() {
    const q = searchEl.value.trim().toLowerCase();
    optionsEl.innerHTML = "";
    const filtered = state.options.filter((o) =>
      o.toLowerCase().includes(q)
    );
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "ms-empty";
      empty.textContent = state.options.length === 0 ? "No options available" : "No matches";
      optionsEl.appendChild(empty);
      return;
    }
    filtered.forEach((val) => {
      const row = document.createElement("label");
      row.className = "ms-option";
      const checked = state.selected.has(val) ? "checked" : "";
      row.innerHTML = `<input type="checkbox" ${checked}/> <span>${escapeHtml(val)}</span>`;
      row.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) state.selected.add(val);
        else state.selected.delete(val);
        renderTags();
        state.onChange(getValues());
      });
      optionsEl.appendChild(row);
    });
  }

  function refresh() {
    renderTags();
    renderOptions();
    state.onChange(getValues());
  }

  function getValues() {
    // Preserve option order
    return state.options.filter((o) => state.selected.has(o));
  }

  function openPanel() {
    state.open = true;
    panelEl.hidden = false;
    controlEl.classList.add("ms-active");
    searchEl.value = "";
    renderOptions();
    searchEl.focus();
  }

  function closePanel() {
    state.open = false;
    panelEl.hidden = true;
    controlEl.classList.remove("ms-active");
  }

  controlEl.addEventListener("click", () => {
    state.open ? closePanel() : openPanel();
  });
  controlEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      state.open ? closePanel() : openPanel();
    }
  });
  searchEl.addEventListener("input", renderOptions);

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) closePanel();
  });

  // Public API
  const api = {
    setOptions(newOptions) {
      state.options = [...newOptions];
      // Drop selected values no longer available
      state.selected.forEach((v) => {
        if (!state.options.includes(v)) state.selected.delete(v);
      });
      renderTags();
      if (state.open) renderOptions();
      state.onChange(getValues());
    },
    setValues(values) {
      state.selected = new Set(
        (values || []).filter((v) => state.options.includes(v))
      );
      renderTags();
      if (state.open) renderOptions();
    },
    getValues,
    clear() {
      state.selected.clear();
      renderTags();
      if (state.open) renderOptions();
    },
  };

  renderTags();
  return api;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
