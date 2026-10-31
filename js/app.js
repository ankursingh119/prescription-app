/*
 * ============================================================================
 *  app.js  —  Application logic: worklist, form, dependent dropdowns, print
 * ============================================================================
 */

(() => {
  "use strict";

  // ---- DOM refs -----------------------------------------------------------
  const worklistView = document.getElementById("worklist-view");
  const formView = document.getElementById("form-view");

  const recordsBody = document.getElementById("records-body");
  const emptyMsg = document.getElementById("empty-msg");
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-status");
  const newBtn = document.getElementById("new-btn");

  const backBtn = document.getElementById("back-btn");
  const formTitle = document.getElementById("form-title");
  const statusBadge = document.getElementById("status-badge");

  const patientNameEl = document.getElementById("patient-name");
  const patientAgeEl = document.getElementById("patient-age");
  const complaintEl = document.getElementById("complaint");
  const prevMedicationEl = document.getElementById("prev-medication");
  const oeEl = document.getElementById("oe");
  const investigationReportEl = document.getElementById("investigation-report");
  const investigationsEl = document.getElementById("investigations");
  const categoriesEl = document.getElementById("categories");
  const subcategoriesEl = document.getElementById("subcategories");
  const exercisesEl = document.getElementById("exercises");
  const dosageField = document.getElementById("dosage-field");
  const dosageRows = document.getElementById("dosage-rows");
  const conclusionEl = document.getElementById("conclusion");
  const insertRxBtn = document.getElementById("insert-rx-btn");
  const adviceTemplatesEl = document.getElementById("advice-templates");

  const saveBtn = document.getElementById("save-btn");
  const savePrintBtn = document.getElementById("save-print-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const autosaveNote = document.getElementById("autosave-note");

  // ---- State --------------------------------------------------------------
  let currentRecord = null;      // record being edited (null = none)
  let msInvest, msCat, msSub, msExercise;    // multiselect instances
  let autosaveTimer = null;

  // Default O.E. template: vitals labels for the doctor to fill in
  const OE_TEMPLATE = "Weight: \nPulse: \nBP: \nTemp(deg F): \nSPO2: ";

  // ---- Init ---------------------------------------------------------------
  function init() {
    fillHeaderFooter();
    setupMultiSelects();
    renderAdviceTemplates();
    wireEvents();
    showWorklist();
  }

  // ---- Print header/footer + screen branding ------------------------------
  function fillHeaderFooter() {
    const d = CONFIG.doctor;
    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const lines = (arr) =>
      (arr || []).map((l) => `<div>${escapeHtml(l)}</div>`).join("");

    // Screen brand
    set("brand-doctor", d.left.name);
    set("brand-clinic", (d.left.lines && d.left.lines[0]) || "");

    // Print header — LEFT column (name, right-aligned qualifications, designations)
    const desig = (d.left.lines || [])
      .map((l) =>
        /^Reg\.?\s*No/i.test(l.trim())
          ? `<div class="ph-reg">${escapeHtml(l)}</div>`
          : `<div>${escapeHtml(l)}</div>`
      )
      .join("");
    setHtml(
      "ph-left",
      `<div class="ph-name">${escapeHtml(d.left.name)}</div>` +
        (d.left.qualifications
          ? `<div class="ph-qual">${escapeHtml(d.left.qualifications)}</div>`
          : "") +
        `<div class="ph-desig">${desig}</div>`
    );

    // Print header — CENTER column (appointment, with aligned phone numbers)
    const c = d.center || {};
    let centerHtml = c.title
      ? `<div class="ph-center-title">${escapeHtml(c.title)}</div>`
      : "";
    if (c.numbers && c.numbers.length) {
      const nums = c.numbers.map((n) => `<div>${escapeHtml(n)}</div>`).join("");
      centerHtml += `<div class="ph-appt">${
        c.label ? `<span class="ph-appt-label">${escapeHtml(c.label)}</span>` : ""
      }<span class="ph-appt-nums">${nums}</span></div>`;
    } else {
      centerHtml += lines(c.lines);
    }
    setHtml("ph-center", centerHtml);

    // Print header — RIGHT column (clinic & timings)
    // Lines ending in ":" (e.g. "Clinic :", "Timing :") render as bold headings.
    const rightHtml = (d.right && d.right.lines ? d.right.lines : [])
      .map((l) =>
        l.trim().endsWith(":")
          ? `<div class="ph-rhead">${escapeHtml(l)}</div>`
          : `<div>${escapeHtml(l)}</div>`
      )
      .join("");
    setHtml("ph-right", rightHtml);
  }

  // ---- Multi-selects ------------------------------------------------------
  function setupMultiSelects() {
    msInvest = createMultiSelect(investigationsEl, {
      placeholder: "Select investigations...",
      options: CONFIG.investigations,
      onChange: scheduleAutosave,
    });

    msCat = createMultiSelect(categoriesEl, {
      placeholder: "Select medicine categories...",
      options: Object.keys(CONFIG.medicineMap),
      onChange: (vals) => {
        updateSubcategoryOptions(vals);
        scheduleAutosave();
      },
    });

    msSub = createMultiSelect(subcategoriesEl, {
      placeholder: "Select medicine subcategories...",
      options: [],
      onChange: (vals) => {
        renderDosageRows(vals);
        scheduleAutosave();
      },
    });

    msExercise = createMultiSelect(exercisesEl, {
      placeholder: "Select exercises...",
      options: CONFIG.exercises || [],
      onChange: scheduleAutosave,
    });
  }

  // Render quick-insert buttons for the fixed advice placeholders
  function renderAdviceTemplates() {
    const templates = CONFIG.adviceTemplates || [];
    adviceTemplatesEl.innerHTML = "";
    templates.forEach((tpl) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-chip";
      btn.textContent = "+ " + tpl;
      btn.addEventListener("click", () => insertAdviceTemplate(tpl));
      adviceTemplatesEl.appendChild(btn);
    });
  }

  // Append a fixed advice placeholder line into the Advice box
  function insertAdviceTemplate(tpl) {
    const current = conclusionEl.value;
    conclusionEl.value = current.trim()
      ? current.replace(/\s*$/, "") + "\n" + tpl
      : tpl;
    conclusionEl.focus();
    scheduleAutosave();
  }

  // Dependent dropdown: subcategories derive from selected categories
  function updateSubcategoryOptions(selectedCategories) {
    const subs = [];
    selectedCategories.forEach((cat) => {
      (CONFIG.medicineMap[cat] || []).forEach((s) => {
        if (!subs.includes(s)) subs.push(s);
      });
    });
    msSub.setOptions(subs); // automatically drops now-invalid selections
  }

  // Render one dosage dropdown per selected medicine (subcategory)
  function renderDosageRows(selectedMeds) {
    if (!currentRecord) return;
    const dosages = currentRecord.medicineDosages || (currentRecord.medicineDosages = {});

    // Drop dosages for medicines no longer selected
    Object.keys(dosages).forEach((med) => {
      if (!selectedMeds.includes(med)) delete dosages[med];
    });

    dosageRows.innerHTML = "";
    dosageField.hidden = selectedMeds.length === 0;

    selectedMeds.forEach((med) => {
      const row = document.createElement("div");
      row.className = "dosage-row";

      const name = document.createElement("span");
      name.className = "dosage-med";
      name.textContent = med;

      const select = document.createElement("select");
      select.className = "dosage-select";
      const ph = document.createElement("option");
      ph.value = "";
      ph.textContent = "Select dosage...";
      select.appendChild(ph);
      (CONFIG.dosageOptions || []).forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        select.appendChild(o);
      });
      select.value = dosages[med] || "";
      select.addEventListener("change", () => {
        dosages[med] = select.value;
        scheduleAutosave();
      });

      row.appendChild(name);
      row.appendChild(select);
      dosageRows.appendChild(row);
    });
  }

  // ---- Events -------------------------------------------------------------
  function wireEvents() {
    newBtn.addEventListener("click", () => openForm(null));
    backBtn.addEventListener("click", async () => {
      await flushAutosave();
      showWorklist();
    });
    searchInput.addEventListener("input", renderWorklist);
    filterSelect.addEventListener("change", renderWorklist);

    saveBtn.addEventListener("click", () => saveRecord(false));
    savePrintBtn.addEventListener("click", () => saveRecord(true));
    deleteBtn.addEventListener("click", onDelete);
    insertRxBtn.addEventListener("click", insertRxIntoConclusion);

    [patientNameEl, patientAgeEl, complaintEl, prevMedicationEl, oeEl, investigationReportEl, conclusionEl].forEach((el) =>
      el.addEventListener("input", scheduleAutosave)
    );
  }

  // Build the medicine + dosage block and insert/refresh it in the Conclusion box
  function insertRxIntoConclusion() {
    if (!currentRecord) return;
    const meds = msSub.getValues();
    if (meds.length === 0) {
      alert("Select at least one medicine first.");
      return;
    }
    const dosages = currentRecord.medicineDosages || {};
    const block = meds
      .map((m) => (dosages[m] ? `${m} — ${dosages[m]}` : m))
      .join("\n");

    const current = conclusionEl.value;
    const prev = currentRecord._rxBlock;
    let next;
    if (prev && current.includes(prev)) {
      // Replace the previously inserted block in place (keeps doctor's edits around it)
      next = current.replace(prev, block);
    } else {
      // Prepend a fresh block
      next = block + (current.trim() ? "\n\n" + current : "");
    }
    conclusionEl.value = next;
    currentRecord._rxBlock = block;
    scheduleAutosave();
  }

  // ---- Worklist -----------------------------------------------------------
  function showWorklist() {
    currentRecord = null;
    formView.hidden = true;
    worklistView.hidden = false;
    renderWorklist();
  }

  async function renderWorklist() {
    const all = await DB.getAll();
    const q = searchInput.value.trim().toLowerCase();
    const statusFilter = filterSelect.value; // all | awaiting_report | completed

    let rows = all
      .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
      .filter((r) => (q ? (r.patientName || "").toLowerCase().includes(q) : true))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    recordsBody.innerHTML = "";
    emptyMsg.hidden = rows.length !== 0;

    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(r.patientName || "(no name)")}</td>
        <td>${statusLabel(r.status)}</td>
        <td>${escapeHtml(summarise(r.investigations))}</td>
        <td>${formatDate(r.updatedAt)}</td>
        <td><button type="button" class="btn btn-sm open-row">Open</button></td>
      `;
      tr.querySelector(".open-row").addEventListener("click", () => openForm(r.id));
      recordsBody.appendChild(tr);
    });
  }

  function summarise(arr) {
    if (!arr || arr.length === 0) return "—";
    return arr.length <= 2 ? arr.join(", ") : `${arr.slice(0, 2).join(", ")} +${arr.length - 2}`;
  }

  // ---- Form ---------------------------------------------------------------
  async function openForm(id) {
    if (id) {
      currentRecord = await DB.get(id);
      if (!currentRecord) {
        alert("Record not found.");
        return showWorklist();
      }
      currentRecord._persisted = true;
    } else {
      currentRecord = newRecord();
    }

    // Populate fields
    patientNameEl.value = currentRecord.patientName || "";
    patientAgeEl.value = currentRecord.age || "";
    complaintEl.value = currentRecord.complaint || "";
    prevMedicationEl.value = currentRecord.prevMedication || "";
    oeEl.value = currentRecord.oe || "";
    investigationReportEl.value = currentRecord.investigationReport || "";
    conclusionEl.value = currentRecord.conclusion || "";

    msInvest.setValues(currentRecord.investigations || []);
    msCat.setValues(currentRecord.medicineCategories || []);
    updateSubcategoryOptions(currentRecord.medicineCategories || []);
    msSub.setValues(currentRecord.medicineSubcategories || []);
    msExercise.setValues(currentRecord.exercises || []);
    renderDosageRows(currentRecord.medicineSubcategories || []);

    updateFormChrome();
    autosaveNote.textContent = "";

    worklistView.hidden = true;
    formView.hidden = false;
    patientNameEl.focus();
  }

  function updateFormChrome() {
    if (!currentRecord) return;
    const isNew = !currentRecord._persisted;
    formTitle.textContent = isNew ? "New Prescription" : "Edit Prescription";
    statusBadge.textContent = statusLabel(currentRecord.status);
    statusBadge.className = "badge " + (currentRecord.status === "completed" ? "badge-done" : "badge-wait");
    deleteBtn.hidden = isNew;
  }

  function collectForm() {
    currentRecord.patientName = patientNameEl.value.trim();
    currentRecord.age = patientAgeEl.value.trim();
    currentRecord.complaint = complaintEl.value.trim();
    currentRecord.prevMedication = prevMedicationEl.value.trim();
    currentRecord.oe = oeEl.value.trim();
    currentRecord.investigationReport = investigationReportEl.value.trim();
    currentRecord.investigations = msInvest.getValues();
    currentRecord.medicineCategories = msCat.getValues();
    currentRecord.medicineSubcategories = msSub.getValues();
    currentRecord.exercises = msExercise.getValues();
    currentRecord.conclusion = conclusionEl.value.trim();
    currentRecord.updatedAt = Date.now();
  }

  async function saveRecord(thenPrint) {
    collectForm();

    if (!currentRecord.patientName) {
      alert("Please enter the patient name before saving.");
      patientNameEl.focus();
      return;
    }

    // Determine status: completed only when medicines + conclusion present
    const hasVisit2 =
      currentRecord.medicineCategories.length > 0 ||
      currentRecord.medicineSubcategories.length > 0 ||
      currentRecord.conclusion;
    currentRecord.status = hasVisit2 ? "completed" : "awaiting_report";
    currentRecord._persisted = true;

    await DB.put(stripInternal(currentRecord));
    updateFormChrome();

    if (thenPrint) {
      doPrint(currentRecord);
    } else {
      showWorklist();
    }
  }

  async function onDelete() {
    if (!currentRecord || !currentRecord._persisted) return;
    if (!confirm("Delete this prescription record permanently?")) return;
    await DB.remove(currentRecord.id);
    showWorklist();
  }

  // ---- Autosave (safety net) ---------------------------------------------
  function scheduleAutosave() {
    if (!currentRecord) return;
    autosaveNote.textContent = "Saving draft…";
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(flushAutosave, 800);
  }

  async function flushAutosave() {
    if (!currentRecord) return;
    clearTimeout(autosaveTimer);
    collectForm();
    if (!currentRecord.patientName) {
      autosaveNote.textContent = "Draft not saved (enter patient name)";
      return;
    }
    // Keep status as awaiting_report for drafts unless already completed
    if (currentRecord.status !== "completed") {
      currentRecord.status = "awaiting_report";
    }
    currentRecord._persisted = true;
    const rec = currentRecord; // capture; may be cleared while awaiting
    await DB.put(stripInternal(rec));
    if (currentRecord === rec) {
      updateFormChrome();
      autosaveNote.textContent = "Draft saved ✓";
    }
  }

  // ---- Printing -----------------------------------------------------------
  function doPrint(record) {
    const area = document.getElementById("print-body");
    area.innerHTML = buildPrintHtml(record);
    window.print();
  }

  function buildPrintHtml(r) {
    const row = (label, value) =>
      value && (Array.isArray(value) ? value.length : value)
        ? `<div class="pr-row"><div class="pr-label">${label}</div>
             <div class="pr-value">${
               Array.isArray(value) ? escapeHtml(value.join(", ")) : escapeHtml(value)
             }</div></div>`
        : "";

    return `
      <div class="pr-meta">
        <span><strong>Patient:</strong> ${escapeHtml(r.patientName || "")}${
          r.age ? `&nbsp;&nbsp;&nbsp;<strong>Age:</strong> ${escapeHtml(r.age)}` : ""
        }</span>
        <span><strong>Date:</strong> ${formatDate(Date.now())}</span>
      </div>
      ${row("Complaint", r.complaint)}
      ${row("Previous Medication", r.prevMedication)}
      ${row("O.E. (On Examination)", r.oe)}
      ${row("Investigations Advised", r.investigations)}
      ${row("Investigation Report", r.investigationReport)}
      ${row("Exercises", r.exercises)}
      ${row("Advice", r.conclusion)}
    `;
  }

  // ---- Helpers ------------------------------------------------------------
  function newRecord() {
    return {
      id: "rx-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      status: "awaiting_report",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      patientName: "",
      age: "",
      complaint: "",
      prevMedication: "",
      oe: OE_TEMPLATE,
      investigationReport: "",
      investigations: [],
      medicineCategories: [],
      medicineSubcategories: [],
      medicineDosages: {},
      exercises: [],
      conclusion: "",
      _persisted: false,
    };
  }

  function stripInternal(r) {
    const { _persisted, _rxBlock, ...clean } = r;
    return clean;
  }

  function statusLabel(s) {
    return s === "completed" ? "Completed" : "Awaiting Report";
  }

  function formatDate(ts) {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
