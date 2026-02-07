"use strict";

const updater = {
    elements: {
        editor: document.getElementById("mainEditor"),

        // Profile Inputs (Modal)
        myFullName: document.getElementById("myFullName"),
        myNickName: document.getElementById("myNickName"),
        myMatric: document.getElementById("myMatric"),

        // Modals & Bars
        modalOverlay: document.getElementById("modalOverlay"),
        settingsBtn: document.getElementById("settingsBtn"),
        addMeBtn: document.getElementById("addMeBtn"),
        btnText: document.querySelector("#addMeBtn .btn-text"),

        // Status
        statusText: document.getElementById("statusText"),
        lineCount: document.getElementById("lineCount"),
        toast: document.getElementById("toast")
    },

    state: {
        lastNumber: 0,
        detectedSeparator: " - ",
        detectedNumberFormat: ". ",
        isUppercase: false,
        hasNumbering: false,
        hasMatric: false,
        matricSeparatorStart: " - ",
        matricSeparatorEnd: "",

        // User Profile
        profile: {
            fullName: "",
            nickName: "",
            matric: ""
        }
    },


    init() {
        // Load User Profile
        this.loadProfile();

        // Ensure fresh start (do not load old list)
        this.elements.editor.value = "";
        this.analyzeList();
        this.updateButtonState(true);

        // --- Event Listeners ---

        // Controls
        this.elements.settingsBtn.addEventListener("click", () => this.openSettings());
        this.elements.addMeBtn.addEventListener("click", () => this.handleMainButtonClick());

        // Editor
        this.elements.editor.addEventListener("input", () => {
            this.saveList();
            this.analyzeList();
        });

        // Prompt user to set up profile if empty
        if (!this.state.profile.fullName) {
            // Optional: Auto open settings on first visit? 
            // Let's just let them discover it via the button, or show a subtle toast
        }
    },

    /* --- Profile Management --- */

    loadProfile() {
        const p = localStorage.getItem("userProfile");
        if (p) {
            this.state.profile = JSON.parse(p);
            // Populate inputs
            this.elements.myFullName.value = this.state.profile.fullName || "";
            this.elements.myNickName.value = this.state.profile.nickName || "";
            this.elements.myMatric.value = this.state.profile.matric || "";
        }
    },

    openSettings() {
        this.elements.modalOverlay.classList.add("show");
    },

    closeSettings() {
        this.elements.modalOverlay.classList.remove("show");
    },

    saveSettings() {
        const full = this.elements.myFullName.value.trim();
        const nick = this.elements.myNickName.value.trim();
        const matric = this.elements.myMatric.value.trim();

        if (!full && !nick) {
            this.showToast("Please enter at least a name!");
            return;
        }

        this.state.profile = { fullName: full, nickName: nick, matric: matric };
        localStorage.setItem("userProfile", JSON.stringify(this.state.profile));

        this.closeSettings();
        this.showToast("Profile Saved!");
    },

    /* --- Main Button Logic --- */

    async handleMainButtonClick() {
        const text = this.elements.editor.value.trim();
        const isEmpty = !text;

        // Show Loading Overlay
        const overlay = document.getElementById("loadingOverlay");
        overlay.classList.add("show");

        try {
            if (isEmpty) {
                // Magic Paste Mode
                const clipboardText = await navigator.clipboard.readText();
                if (!clipboardText || !clipboardText.trim()) {
                    this.showToast("Clipboard is empty!");
                    return;
                }

                // Simulate interaction delay for feel (optional but nice)
                await new Promise(r => setTimeout(r, 600));

                this.elements.editor.value = clipboardText;
                this.saveList();
                this.analyzeList();

                this.autoAddMe();
            } else {
                // Normal Add Mode
                await new Promise(r => setTimeout(r, 400)); // Tiny delay for UI feel
                this.autoAddMe();
            }
        } catch (err) {
            console.error(err);
            this.showToast("⚠️ Action failed or denied!");
        } finally {
            // Restore State
            overlay.classList.remove("show");

            // The text will be updated by analyzeList/updateButtonState anyway, 
            // but let's ensure it's correct based on current content
            const newText = this.elements.editor.value.trim();
            this.updateButtonState(!newText);
        }
    },

    updateButtonState(isEmpty) {
        if (!this.elements.btnText) return;
        if (isEmpty) {
            this.elements.btnText.textContent = "Paste & Add Me";
        } else {
            this.elements.btnText.textContent = "Add Me & Copy";
        }
    },

    /* --- Core Logic --- */

    saveList() {
        localStorage.setItem("currentList", this.elements.editor.value);
    },

    analyzeList() {
        const text = this.elements.editor.value.trim();
        const lines = text ? text.split('\n').filter(l => l.trim().length > 0) : [];
        this.elements.lineCount.textContent = `${lines.length} lines`;

        // Reset State
        this.state.lastNumber = 0;
        this.state.detectedNumberFormat = ". ";
        this.state.hasNumbering = false;
        this.state.hasMatric = false;
        this.state.matricSeparatorStart = " ("; // Default to Format 1 style
        this.state.matricSeparatorEnd = ")";

        if (lines.length === 0) {
            this.elements.statusText.textContent = "Waiting for input...";
            this.updateButtonState(true);
            return;
        } else {
            this.updateButtonState(false);
        }

        // 1. Detect Case (>80% uppercase)
        const letters = text.replace(/[^a-zA-Z]/g, '');
        const upper = letters.replace(/[^A-Z]/g, '');
        this.state.isUppercase = letters.length > 0 && (upper.length / letters.length > 0.8);

        // 2. Detect Pattern (scan last 10 lines)
        const scanDepth = Math.min(lines.length, 10);
        let numberMatches = 0;
        let matricMatches = 0;

        let lastNum = 0;
        let detectedFormat = ". ";

        // Tally separators
        const separators = {};

        for (let i = 0; i < scanDepth; i++) {
            const line = lines[lines.length - 1 - i].trim();

            // A. Detect Numbering: "^1. ", "^1) ", "^[1] ", "^1 - ", "^1- "
            // Added support for " - " (space dash) and "- " (dash space)
            const numMatch = line.match(/^(\d+)(\s*[\.\)\-\]]\s*)?\s+/);
            if (numMatch) {
                const num = parseInt(numMatch[1], 10);
                if (!isNaN(num)) {
                    // Update only if it looks like the sequence end (highest number found at bottom?)
                    if (i === 0) {
                        lastNum = num;
                        // The separator is usually group 2 + any following space implied by the \s+ outside
                        // Let's reconstruct exact suffix by slicing
                        const prefix = num.toString();
                        const numIndex = line.indexOf(prefix);
                        // Find where the name starts (first letter?) 
                        // Or just use the length of the match
                        const fullMatch = numMatch[0];
                        // The suffix is everything after the number digits in the match
                        detectedFormat = fullMatch.substring(prefix.length);

                        // Clean up newlines if regex matched across lines (unlikely with ^)
                    }
                    numberMatches++;
                }
            }

            // B. Detect Matric & Separator
            // Look for 5+ alphanumeric characters (containing at least 1 digit) that are NOT at the start
            // Pattern: Separator (Non-word chars like " - ", " (", etc.) + Matric + OptionalEnding
            const matricRegex = /([^\w]+)(\w{5,}\d|\w+\d{4,})(\W*)$/;
            const matMatch = line.match(matricRegex);

            if (matMatch) {
                const sep = matMatch[1]; // chars before matric
                const mat = matMatch[2]; // the matric itself
                const end = matMatch[3]; // chars after matric (e.g. ")", "]", "}")

                // Validate matric is not the number prefix
                if (line.indexOf(mat) > 3) {
                    matricMatches++;
                    const key = `${sep}|${end}`;
                    separators[key] = (separators[key] || 0) + 1;
                }
            }
        }

        // Finalize Detection
        this.state.hasNumbering = numberMatches > 0;
        this.state.lastNumber = lastNum;
        if (this.state.hasNumbering) this.state.detectedNumberFormat = detectedFormat;

        this.state.hasMatric = matricMatches > 0;
        if (this.state.hasMatric) {
            // Find most common separator
            const bestSep = Object.keys(separators).reduce((a, b) => separators[a] > separators[b] ? a : b, " (|)");
            const [start, end] = bestSep.split('|');
            this.state.matricSeparatorStart = start;
            this.state.matricSeparatorEnd = end || "";
        } else if (this.state.hasNumbering) {
            // Infer Matric Separator from Number Format (Namelist.js Style)
            const fmt = this.state.detectedNumberFormat.trim();
            if (fmt === "-") {
                this.state.matricSeparatorStart = " - ";
                this.state.matricSeparatorEnd = "";
            } else if (fmt === "|") {
                this.state.matricSeparatorStart = " | ";
                this.state.matricSeparatorEnd = "";
            } else if (fmt === ",") {
                this.state.matricSeparatorStart = ", ";
                this.state.matricSeparatorEnd = "";
            } else {
                // Default (e.g. "1. ") -> Parens
                this.state.matricSeparatorStart = " (";
                this.state.matricSeparatorEnd = ")";
            }
        }

        // Status Update
        let status = "Detected: ";
        status += this.state.hasNumbering ? "Numbered" : "Unordered";
        status += this.state.hasMatric ? " + Matrics" : "";
        if (this.state.isUppercase) status += " (CAPS)";
        this.elements.statusText.textContent = status;
    },

    autoAddMe() {
        // 1. Check Profile
        if (!this.state.profile.fullName && !this.state.profile.nickName) {
            this.showToast("⚠️ Set up your profile first!");
            this.openSettings();
            return;
        }

        // 2. Analyze Current List
        this.analyzeList();

        // 3. Determine Format (Full Name vs Nickname)
        // Heuristic: Check if list uses full names (contains 'bin', 'binti', etc.)
        // Only trigger this heuristic if input has lines
        const text = this.elements.editor.value;
        const hasFullNames = /\b(bin|binti|a\/l|a\/p)\b/i.test(text);

        // Default to Full Name if heuristic matches OR if nickname is missing
        let targetName = this.state.profile.fullName;
        if (!targetName) targetName = this.state.profile.nickName;

        // Use Nickname if heuristic fails (informal list) AND nickname exists
        if (!hasFullNames && this.state.profile.nickName) {
            targetName = this.state.profile.nickName;
        }

        if (this.state.isUppercase) {
            targetName = targetName.toUpperCase();
        }

        // 4. Build String
        let newLine = "";

        // Numbering
        if (this.state.hasNumbering || (!text.trim() && !this.state.hasNumbering)) {
            // Be helpful: If empty list, start at 1.
            const nextNum = this.state.hasNumbering ? (this.state.lastNumber + 1) : 1;
            newLine += `${nextNum}${this.state.detectedNumberFormat}`;
            this.state.lastNumber = nextNum; // Update for consecutive adds
        }

        newLine += targetName;

        // Matric
        if ((this.state.hasMatric || (!text.trim() && !this.state.hasMatric)) && this.state.profile.matric) {
            // Check if separator needs logic (e.g. if it is empty, default to space?)
            // We rely on matricSeparatorStart providing the spacing.
            newLine += `${this.state.matricSeparatorStart}${this.state.profile.matric}${this.state.matricSeparatorEnd}`;
        }

        // 5. Append
        const currentText = this.elements.editor.value;
        const prefix = (currentText && !currentText.endsWith('\n')) ? "\n" : "";
        this.elements.editor.value = currentText + prefix + newLine;

        // 6. Scroll & Save
        this.elements.editor.scrollTop = this.elements.editor.scrollHeight;
        this.saveList();

        // 7. Copy & Feedback
        this.copyText();
        this.showToast("Added & Copied! 🚀");

        // Animate Button
        const btn = this.elements.addMeBtn;
        btn.style.transform = "scale(0.95)";
        setTimeout(() => btn.style.transform = "scale(1)", 150);
    },

    clearText() {
        if (confirm("Clear all text?")) {
            this.elements.editor.value = "";
            this.saveList();
            this.analyzeList();
        }
    },

    copyText() {
        const text = this.elements.editor.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            // Toast handled by caller usually, but duplicate is fine
        }).catch(() => {
            this.elements.editor.select();
            document.execCommand("copy");
        });
    },

    loadSample() {
        const samples = [
            `1. Ahmad Albab - 2024001\n2. Siti Sarah - 2024002`,
            `1. MUHAMMAD ALI : A12345\n2. NURUL HUDA : A12346`,
            `John Doe\t88291\nJane Smith\t88292`
        ];
        this.elements.editor.value = samples[Math.floor(Math.random() * samples.length)];
        this.analyzeList();
        this.showToast("Sample Loaded");
    },

    showToast(msg) {
        const t = this.elements.toast;
        t.innerText = msg;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 2500);
    }
};

document.addEventListener("DOMContentLoaded", () => updater.init());
