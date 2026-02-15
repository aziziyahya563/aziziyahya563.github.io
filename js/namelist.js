"use strict";

const namelist = {
  data: [], // Full imported data
  filteredData: [], // Data after search
  checkedItems: new Set(), // Set of nomatric strings

  elements: {
    fileInput: document.getElementById("file-input"),
    searchInput: document.getElementById("search-input"),
    sourceTableBody: document.getElementById("namelist-body"),
    selectedTableBody: document.getElementById("selected-body"),
    generateBtn: document.getElementById("generate-table"),
    invertBtn: document.getElementById("invert-selection"),
    resetBtn: document.getElementById("reset-upload"),

    // Toggles
    includeIndex: document.getElementById("include-index"),
    includeName: document.getElementById("include-name"),
    includeMatric: document.getElementById("include-nomatric"),

    // Export
    copyBtn: document.getElementById("copy-to-clipboard"),
    exportExcelBtn: document.getElementById("export-excel"),
    exportJsonBtn: document.getElementById("export-json")
  },

  init() {
    this.loadStorage();
    this.bindEvents();
    // Load default if empty?
    if (this.data.length === 0) this.fetchDefaultData();
  },

  bindEvents() {
    // File Import
    this.elements.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

    // Reset
    this.elements.resetBtn.addEventListener("click", () => this.resetData());

    // Search
    this.elements.searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));

    // Selection Logic
    this.elements.invertBtn.addEventListener("click", () => this.invertSelection());

    // Table Generation
    this.elements.generateBtn.addEventListener("click", () => this.renderSelectedTable());

    // Copy/Export
    this.elements.copyBtn.addEventListener("click", () => this.copyToClipboard());
    this.elements.exportExcelBtn.addEventListener("click", () => this.exportToExcel());
    this.elements.exportJsonBtn.addEventListener("click", () => this.exportToJson());

    // Column Toggles (Live Update Selected Table)
    // Column Toggles (Live Update Selected Table + Preview)
    [this.elements.includeIndex, this.elements.includeName, this.elements.includeMatric].forEach(el => {
      if (el) {
        el.addEventListener("change", () => {
          this.renderSelectedTable();
          this.updateFormatPreview();
        });
      }
    });

    // Format Radio Listeners
    document.querySelectorAll('input[name="copy-format"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateFormatPreview(radio.value));
    });

    // Initial Preview
    this.updateFormatPreview();


    // Source Table Checkbox Delegation
    this.elements.sourceTableBody.addEventListener("change", (e) => {
      if (e.target.matches(".row-checkbox")) {
        this.handleCheckboxChange(e.target);
      }
    });

    // Header Select All (if present)
    const selectAllHeader = document.querySelector('[data-sort="select"]');
    if (selectAllHeader) {
      selectAllHeader.addEventListener("click", () => this.toggleSelectAll());
    }

    // Sorting delegations
    document.querySelectorAll('.sortable').forEach(th => {
      th.addEventListener('click', (e) => this.handleSort(e.target));
    });
  },

  /* --- Helper: Toast Notification --- */
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `<span>${icon}</span> ${message}`;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 2500);
  },

  /* --- Data Handling --- */

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.endsWith(".json")) {
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          this.processData(json);
          this.showToast(`Imported ${json.length} records`);
        } catch (err) { this.showToast("Invalid JSON File", "error"); }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          this.processData(json);
          this.showToast(`Imported ${json.length} records`);
        } catch (err) { this.showToast("Invalid Excel File", "error"); }
      };
      reader.readAsArrayBuffer(file);
    }
  },

  processData(rawData) {
    if (!Array.isArray(rawData)) return;

    // Normalize keys
    this.data = rawData.map((item, idx) => ({
      // Try to find reasonable keys regardless of case
      name: item.name || item.Name || item.NAME || "Unknown",
      nomatric: (item.nomatric || item.matric || item.Matric || item.id || "").toString(),
      originalIndex: idx
    }));

    this.filteredData = [...this.data];
    this.checkedItems.clear();
    this.saveStorage();
    this.renderSourceTable();
    this.renderSelectedTable(); // Ensure empty state updates
  },

  resetData() {
    if (confirm("Clear all imported data?")) {
      this.data = [];
      this.filteredData = [];
      this.checkedItems.clear();
      localStorage.removeItem("namelistData");
      this.renderSourceTable();
      this.renderSelectedTable();
      this.showToast("All data cleared", "success");
    }
  },

  fetchDefaultData() {
    // Hardcoded Demo Data to ensure reliable demo experience
    const demoData = [
      { name: "Ali Bin Abu", nomatric: "A19EC0001" },
      { name: "Siti Nurhaliza", nomatric: "A19EC0002" },
      { name: "John Doe", nomatric: "A19EC0003" },
      { name: "Chong Wei", nomatric: "A19EC0004" },
      { name: "Muthusamy", nomatric: "A19EC0005" },
      { name: "Sarah Connor", nomatric: "A19EC0006" }
    ];

    this.processData(demoData);
    this.showToast("Demo data loaded");
  },

  saveStorage() {
    localStorage.setItem("namelistData", JSON.stringify(this.data));
  },

  loadStorage() {
    const stored = localStorage.getItem("namelistData");
    if (stored) {
      this.processData(JSON.parse(stored));
    }
  },

  /* --- UI Rendering --- */

  renderSourceTable() {
    const tbody = this.elements.sourceTableBody;
    tbody.innerHTML = "";

    this.filteredData.forEach((item, idx) => {
      const tr = document.createElement("tr");
      tr.className = "clickable-row"; // Add hover effect

      const isChecked = this.checkedItems.has(item.nomatric);

      // Make the whole row clickable for selection
      tr.onclick = (e) => {
        // Prevent double toggling if clicking directly on checkbox
        if (e.target.type !== 'checkbox') {
          const checkbox = tr.querySelector('.row-checkbox');
          checkbox.checked = !checkbox.checked;
          this.handleCheckboxChange(checkbox);
        }
      };

      tr.innerHTML = `
                <td style="text-align:center"><input type="checkbox" class="row-checkbox" value="${item.nomatric}" ${isChecked ? "checked" : ""}></td>
                <td>${item.name.toUpperCase()}</td>
                <td>${item.nomatric}</td>
            `;
      tbody.appendChild(tr);
    });
  },

  renderSelectedTable() {
    const tbody = this.elements.selectedTableBody;
    tbody.innerHTML = "";

    // Filter logic
    const selectedData = this.data.filter(item => this.checkedItems.has(item.nomatric));

    if (selectedData.length === 0) {
      document.getElementById("selected-empty-msg").style.display = "flex";
      // Hide table header if empty for cleaner look? No, keep it stable.
      return;
    }
    document.getElementById("selected-empty-msg").style.display = "none";

    const showIndex = this.elements.includeIndex.checked;
    const showName = this.elements.includeName.checked;
    const showMatric = this.elements.includeMatric.checked;

    // Update Header Visibility
    const theadRow = document.querySelector("#selected-table thead tr");
    if (theadRow) {
      theadRow.innerHTML = `
                ${showIndex ? '<th style="width:40px">#</th>' : ''}
                ${showName ? '<th class="sortable" data-sort="name">Name</th>' : ''}
                ${showMatric ? '<th class="sortable" data-sort="nomatric">Matric</th>' : ''}
            `;
    }

    selectedData.forEach((item, idx) => {
      const tr = document.createElement("tr");
      let html = "";
      if (showIndex) html += `<td>${idx + 1}</td>`;
      if (showName) html += `<td>${item.name.toUpperCase()}</td>`;
      if (showMatric) html += `<td>${item.nomatric}</td>`;
      tr.innerHTML = html;
      tbody.appendChild(tr);
    });
  },

  /* --- Logic --- */

  handleSearch(query) {
    const lower = query.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.name.toLowerCase().includes(lower) ||
      item.nomatric.includes(lower)
    );
    this.renderSourceTable();
  },

  handleCheckboxChange(checkbox) {
    if (checkbox.checked) {
      this.checkedItems.add(checkbox.value);
    } else {
      this.checkedItems.delete(checkbox.value);
    }
    // Optional: render selected table live?
    // this.renderSelectedTable(); 
  },

  invertSelection() {
    const displayedIds = new Set(this.filteredData.map(d => d.nomatric));

    displayedIds.forEach(id => {
      if (this.checkedItems.has(id)) this.checkedItems.delete(id);
      else this.checkedItems.add(id);
    });

    this.renderSourceTable();
    this.showToast("Selection Inverted");
  },

  toggleSelectAll() {
    const displayedIds = this.filteredData.map(d => d.nomatric);
    const allSelected = displayedIds.every(id => this.checkedItems.has(id));

    if (allSelected) {
      displayedIds.forEach(id => this.checkedItems.delete(id));
      this.showToast("Unselected All");
    } else {
      displayedIds.forEach(id => this.checkedItems.add(id));
      this.showToast("Selected All");
    }
    this.renderSourceTable();
  },

  handleSort(header) {
    const key = header.dataset.sort;
    if (!key || key === 'select') return;

    const order = header.dataset.order === 'asc' ? 'desc' : 'asc';
    header.dataset.order = order;

    // Perform sort
    if (header.closest('#namelist-table')) {
      this.filteredData.sort((a, b) => this.compare(a, b, key, order));
      this.renderSourceTable();
    } else {
      // Sort selected table? We usually sort the source list. 
    }
  },

  compare(a, b, key, order) {
    const valA = a[key] || "";
    const valB = b[key] || "";
    let comparison = 0;

    if (key === 'nomatric') {
      comparison = parseInt(valA) - parseInt(valB);
    } else {
      comparison = valA.toString().localeCompare(valB.toString());
    }
    return order === 'asc' ? comparison : -comparison;
  },

  /* --- Export / Copy --- */

  updateFormatPreview(format) {
    const previewBox = document.getElementById('format-preview-box');
    if (!previewBox) return;

    if (!format) {
      const checked = document.querySelector('input[name="copy-format"]:checked');
      format = checked ? checked.value : 'format1';
    }

    // Dummy item for preview
    const dummyItem = { name: "ALI BIN ABU", nomatric: "A19EC0001" };
    const formatted = this.formatSingleItem(dummyItem, 0, format);
    previewBox.textContent = formatted;
  },

  formatSingleItem(item, idx, format) {
    const indexStr = this.elements.includeIndex.checked ? `${idx + 1}` : "";
    const name = this.elements.includeName.checked ? item.name.toUpperCase() : "";
    const matric = this.elements.includeMatric.checked ? item.nomatric : "";

    switch (format) {
      case 'format1': // 1. Name - ID
        return `${indexStr ? indexStr + "." : ""} ${name}${name && matric ? " (" : ""}${matric}${name && matric ? ")" : ""}`;
      case 'format3': // Name - ID (Dash)
        return [indexStr.trim(), name, matric].filter(x => x).join(" - ");
      case 'format4': // Pipe
        return [indexStr.trim(), name, matric].filter(x => x).join(" | ");
      case 'format5': // Comma
        return [indexStr.trim(), name, matric].filter(x => x).join(", ");
      case 'format2': // Multiline
        let lines = [];
        if (indexStr) lines.push(indexStr);
        if (name) lines.push(`Name: ${name}`);
        if (matric) lines.push(`Matric: ${matric}`);
        return lines.join("\n") + "\n";
      default:
        return `${indexStr}${name} ${matric}`;
    }
  },

  generateFormattedText() {
    const formatBtn = document.querySelector('input[name="copy-format"]:checked');
    const format = formatBtn ? formatBtn.value : 'format1';

    const selectedData = this.data.filter(item => this.checkedItems.has(item.nomatric));

    return selectedData.map((item, idx) => {
      return this.formatSingleItem(item, idx, format);
    }).join("\n");
  },

  copyToClipboard() {
    const text = this.generateFormattedText();
    if (!text) return this.showToast("Select users first!", "error");

    // Prefer modern Clipboard API (works on recent iOS Safari over HTTPS)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast("Copied to Clipboard!", "success");
      }).catch((err) => {
        console.warn('navigator.clipboard failed, falling back:', err);
        this._fallbackCopy(text);
      });
      return;
    }

    // Fallback for older browsers / Safari
    this._fallbackCopy(text);
  },

  // Internal fallback that tries to reliably copy using a hidden textarea.
  _fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Place off-screen but focusable. Absolute + opacity works better on iOS than fixed offsets.
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);

    // Focus then select. iOS needs the element focused for setSelectionRange/select to work.
    textarea.focus();

    try {
      // Try the straightforward select first. On iOS this usually works when focused.
      textarea.select();
      textarea.setSelectionRange(0, text.length);

      const successful = document.execCommand('copy');
      if (successful) {
        this.showToast("Copied to Clipboard!", "success");
      } else {
        this.showToast("Failed to copy", "error");
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.showToast("Failed to copy", "error");
    } finally {
      // Clean up
      textarea.blur();
      document.body.removeChild(textarea);
    }
  },

  exportToExcel() {
    const selectedData = this.data.filter(item => this.checkedItems.has(item.nomatric));
    if (selectedData.length === 0) return this.showToast("Nothing to export", "error");

    try {
      const ws = XLSX.utils.json_to_sheet(selectedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Selected");
      XLSX.writeFile(wb, "vibelist-_export.xlsx");
      this.showToast("Excel exported");
    } catch (e) {
      this.showToast("Export failed", "error");
    }
  },

  exportSourceToExcel() {
    if (this.data.length === 0) return this.showToast("No data to export", "error");

    try {
      // Create a clean copy for export (removing internal keys if needed, or keeping them is fine)
      // formatting columns for nicer excel if possible?
      // Let's just dump the data as is, similar to normal export
      const ws = XLSX.utils.json_to_sheet(this.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Source List");
      XLSX.writeFile(wb, "vibelist-source.xlsx");
      this.showToast("Source list exported");
    } catch (e) {
      this.showToast("Export failed", "error");
    }
  },

  exportToJson() {
    const selectedData = this.data.filter(item => this.checkedItems.has(item.nomatric));
    if (selectedData.length === 0) return this.showToast("Nothing to export", "error");

    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vibelist-export.json';
    a.click();
    this.showToast("JSON exported");
  }
};

document.addEventListener("DOMContentLoaded", () => namelist.init());
