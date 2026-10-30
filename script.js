/* ==========================================================================
   PRODUCTIVE MUSLIM APPLICATION CODEBASE
   State Management, Web Audio Alarms, Routine Planner, Pomodoro, Ahtisaab Logs
   ========================================================================== */

// CURATED INSPIRATIONS (Aya & Hadith of the Day)
const INSPIRATION_DATABASE = [
    {
        quote: "Sufficient is your soul today as an accountant against you. (اپنا احتساب کرنے کے لیے آج تم خود ہی کافی ہو۔)",
        source: "Surah Al-Isra 17:14"
    },
    {
        quote: "Indeed, prayer prohibits immorality and wrongdoing. (بے شک نماز بے حیائی اور برائی سے روکتی ہے۔)",
        source: "Surah Al-Ankabut 29:45"
    },
    {
        quote: "The deeds most loved by Allah are those done regularly, even if they are small. (اللہ کے نزدیک سب سے پسندیدہ عمل وہ ہے جو مستقل کیا جائے، چاہے وہ تھوڑا ہی کیوں نہ ہو۔)",
        source: "Prophet Muhammad (ﷺ) — Sahih al-Bukhari"
    },
    {
        quote: "Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free-time before your difficulty, and your life before your death.",
        source: "Prophet Muhammad (ﷺ) — Al-Hakim"
    },
    {
        quote: "And whoever fears Allah - He will make for him a way out and provide for him from where he does not expect. (اور جو اللہ سے ڈرتا ہے، اللہ اس کے لیے نکلنے کا راستہ بنا دیتا ہے اور اسے ایسی جگہ سے رزق دیتا ہے جہاں سے اسے گمان بھی نہیں ہوتا۔)",
        source: "Surah At-Talaq 65:2-3"
    },
    {
        quote: "By time, indeed, mankind is in loss, except those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
        source: "Surah Al-Asr 103:1-3"
    },
    {
        quote: "My mercy encompasses all things. (اور میری رحمت ہر چیز پر محیط ہے۔)",
        source: "Surah Al-A'raf 7:156"
    },
    {
        quote: "Cleanliness is half of faith (Eman). (صفائی نصف ایمان ہے۔)",
        source: "Prophet Muhammad (ﷺ) — Sahih Muslim"
    },
    {
        quote: "Seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah].",
        source: "Surah Al-Baqarah 2:45"
    },
    {
        quote: "Remember Me; I will remember you. (پس تم مجھے یاد کرو، میں تمہیں یاد کروں گا۔)",
        source: "Surah Al-Baqarah 2:152"
    }
];

// STATE MANAGEMENT Abstraction
let state = {
    userName: "Learner",
    morningSinFocus: "",
    namazStatus: {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
        tahajjud: false
    },
    namazAlarmTimes: {
        fajr: "04:30",
        dhuhr: "13:15",
        asr: "17:00",
        maghrib: "19:25",
        isha: "20:55",
        tahajjud: "03:15"
    },
    namazAlarmSwitches: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        tahajjud: false
    },
    routineTasks: [
        { id: 1, name: "Morning Dhikr & Supplications (صبح کے اذکار)", category: "spiritual", completed: false },
        { id: 2, name: "Review Quran & Aya (تلاوتِ قرآن)", category: "spiritual", completed: false },
        { id: 3, name: "Daily Study Review (مطالعہ)", category: "academic", completed: false },
        { id: 4, name: "Light Stretch/Exercise (ورزش)", category: "health", completed: false }
    ],
    courses: [
        { id: 301, name: "DIT", desc: "Diploma in Information Technology" },
        { id: 302, name: "Islamic Studies", desc: "Spiritual and Academic courses" }
    ],
    subjects: [
        { id: 101, courseId: 302, name: "Quranic Arabic", desc: "Translation & daily grammar", color: "#5cb87a" },
        { id: 102, courseId: 301, name: "Web Development", desc: "JavaScript & CSS projects", color: "#5b8dee" },
        { id: 103, courseId: 301, name: "Discrete Mathematics", desc: "Proofs, logic & graphs", color: "#e5a34b" }
    ],
    studyBlocks: [
        { id: 201, courseId: 302, subjectId: 101, subjectName: "Quranic Arabic", subjectColor: "#5cb87a", day: "Monday", startTime: "09:30", endTime: "10:30", topic: "Translate Surah Al-Mulk", alarmEnabled: true, done: true },
        { id: 202, courseId: 301, subjectId: 102, subjectName: "Web Development", subjectColor: "#5b8dee", day: "Tuesday", startTime: "14:00", endTime: "15:30", topic: "Build responsive layout grid", alarmEnabled: true, done: false }
    ],
    ahtisaabHistory: [
        {
            date: "Yesterday",
            resolvedSin: "Doomscrolling / Wasting Time",
            extraSins: ["Wasting time / Social Media"],
            goodDeeds: ["Offered All Prayers On Time", "Read Morning & Evening Adhkar"],
            istighfarCount: 70,
            journal: "Faltered for around 30 mins after Asr, but recovered. Will try harder to keep device away tomorrow.",
            status: "no"
        },
        {
            date: "2 Days Ago",
            resolvedSin: "Backbiting / Gheebat",
            extraSins: [],
            goodDeeds: ["Offered All Prayers On Time", "Recited Holy Quran", "Completed Study Blocks"],
            istighfarCount: 100,
            journal: "Kept a conscious check on my tongue today, Alhamdulillah. Felt very peaceful.",
            status: "yes"
        }
    ],
    istighfarToday: 0,
    ahtisaabStatusToday: null
};

// Global Active Sound Variable
let activeAudioContext = null;
let currentAlarmInterval = null;
let currentActiveAlarmName = "";
let currentActiveAlarmType = ""; // "prayer" or "study"
let currentActiveAlarmBlockId = null; // if type is "study"

// POMODORO TIMER STATE
let pomoTimerDuration = 1500; // 25 minutes default in seconds
let pomoTimerRemaining = 1500;
let pomoTimerInterval = null;
let pomoTimerIsRunning = false;

// -------------------------------------------------------------
// APP INITIALIZATION
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    initClockAndDates();
    initTabNavigation();
    initInspirationSlider();
    initNamazModule();
    initRoutineModule();
    initStudyModule();
    initPomodoroModule();
    initAhtisaabModule();
    
    // Background interval check for dynamic Prayer and Study alarms
    setInterval(() => {
        checkPrayerAlarms();
        checkStudyAlarms();
    }, 30000); // Check every 30 seconds

    // Ask users for notifications if they click
    document.getElementById("btn-request-notifications").addEventListener("click", requestNotificationAccess);
});

// Load state from localStorage on startup
function loadStateFromStorage() {
    const cachedData = localStorage.getItem("productive_muslim_state");
    if (cachedData) {
        try {
            const parsed = JSON.parse(cachedData);
            // Deep merge safety
            state = { ...state, ...parsed };
            // Ensure nested objects preserve correct merges
            state.namazStatus = { ...state.namazStatus, ...parsed.namazStatus };
            state.namazAlarmTimes = { ...state.namazAlarmTimes, ...parsed.namazAlarmTimes };
            state.namazAlarmSwitches = { ...state.namazAlarmSwitches, ...parsed.namazAlarmSwitches };
            
            // Safety configurations for schema migrations
            if (!state.courses) {
                state.courses = [
                    { id: 301, name: "DIT", desc: "Diploma in Information Technology" },
                    { id: 302, name: "Islamic Studies", desc: "Spiritual and Academic courses" }
                ];
            }
            if (state.subjects) {
                state.subjects.forEach(subj => {
                    if (!subj.courseId) {
                        if (subj.id === 101) subj.courseId = 302;
                        else if (subj.id === 102 || subj.id === 103) subj.courseId = 301;
                        else subj.courseId = state.courses[0].id;
                    }
                });
            }
            if (state.studyBlocks) {
                state.studyBlocks.forEach(block => {
                    if (!block.day) block.day = "Monday";
                    if (block.alarmEnabled === undefined) block.alarmEnabled = true;
                    if (!block.courseId && block.subjectId) {
                        const subj = state.subjects.find(s => s.id === block.subjectId);
                        if (subj) block.courseId = subj.courseId;
                    }
                });
            }
        } catch (e) {
            console.error("Error reading localStorage:", e);
        }
    } else {
        // Save initial default presets to localStorage immediately
        saveStateToStorage();
    }
}

// Write state into localStorage
function saveStateToStorage() {
    localStorage.setItem("productive_muslim_state", JSON.stringify(state));
}

// -------------------------------------------------------------
// ALARM SYSTEM (WEB AUDIO API SYNTHESIZER)
// -------------------------------------------------------------
function playSpiritualChime(type) {
    try {
        // Initialize AudioContext on user action to meet security policies
        if (!activeAudioContext) {
            activeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (activeAudioContext.state === 'suspended') {
            activeAudioContext.resume();
        }

        const now = activeAudioContext.currentTime;

        if (type === 'alarm') {
            // Calm spiritual chime chord (E Major 9/11 harmonic synthesizer)
            const notes = [329.63, 415.30, 493.88, 739.99]; // E4, G#4, B4, F#5
            notes.forEach((freq, index) => {
                const osc = activeAudioContext.createOscillator();
                const gainNode = activeAudioContext.createGain();
                
                // Set oscillator sound characteristics
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + (index * 0.15));
                
                // Gain node envelopes
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.12, now + (index * 0.15) + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3);
                
                osc.connect(gainNode);
                gainNode.connect(activeAudioContext.destination);
                
                osc.start(now);
                osc.stop(now + 3);
            });
        } else if (type === 'success') {
            // Uplifting melody (C5 -> E5 -> G5 -> C6)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, index) => {
                const osc = activeAudioContext.createOscillator();
                const gainNode = activeAudioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + (index * 0.08));
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.15, now + (index * 0.08) + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
                
                osc.connect(gainNode);
                gainNode.connect(activeAudioContext.destination);
                
                osc.start(now);
                osc.stop(now + 1.8);
            });
        } else if (type === 'tick') {
            // Neutral click sound for beads/Tasbih
            const osc = activeAudioContext.createOscillator();
            const gainNode = activeAudioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            
            osc.connect(gainNode);
            gainNode.connect(activeAudioContext.destination);
            
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        console.error("Audio Synthesis error: ", e);
    }
}

// Request permission for Web Notifications
function requestNotificationAccess() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const banner = document.getElementById("notification-prompt-banner");
                if (banner) banner.classList.add("hidden");
                
                // Show confirmation notification
                new Notification("Alarms Enabled", {
                    body: "ProductiveMuslim will alert you during prayer & study timers.",
                    icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232ecc71'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/></svg>"
                });
            }
        });
    }
}

// Check notification permissions for banner visibility
function updateNotificationBannerState() {
    const banner = document.getElementById("notification-prompt-banner");
    if (!banner) return;
    
    if (!("Notification" in window) || Notification.permission === "granted") {
        banner.classList.add("hidden");
    } else {
        banner.classList.remove("hidden");
    }
}

// Triggering Alarms
function triggerPrayerAlarm(name) {
    if (currentAlarmInterval) return; // Already ringing!

    currentActiveAlarmName = name;
    currentActiveAlarmType = "prayer";
    
    // Display Alarm ring overlay Modal
    const alarmModal = document.getElementById("modal-alarm-ringing");
    const alarmTitle = document.getElementById("ringing-alarm-name");
    const alarmDesc = document.getElementById("ringing-alarm-message");
    
    alarmTitle.innerText = `${name.toUpperCase()} PRAYER TIME`;
    alarmDesc.innerText = `It is time to offer your ${name} Salah. Please take a break and stand for prayer.`;
    
    alarmModal.classList.add("active");
    
    // Sound Loop
    playSpiritualChime('alarm');
    currentAlarmInterval = setInterval(() => {
        playSpiritualChime('alarm');
    }, 4500);

    // Push local notification
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Time for ${name}`, {
            body: `Adhan timer triggered! Prepare for the ${name} prayer.`,
            requireInteraction: true
        });
    }
}

function triggerStudyAlarm(block) {
    if (currentAlarmInterval) return; // Already ringing!

    currentActiveAlarmName = block.subjectName;
    currentActiveAlarmType = "study";
    currentActiveAlarmBlockId = block.id;
    
    // Display Alarm ring overlay Modal
    const alarmModal = document.getElementById("modal-alarm-ringing");
    const alarmTitle = document.getElementById("ringing-alarm-name");
    const alarmDesc = document.getElementById("ringing-alarm-message");
    const alarmDismissBtn = document.getElementById("btn-dismiss-alarm");
    
    alarmTitle.innerText = `STUDY SLOT: ${block.subjectName.toUpperCase()}`;
    const course = state.courses ? state.courses.find(c => c.id === block.courseId) : null;
    const courseText = course ? ` in Course ${course.name}` : "";
    alarmDesc.innerText = `It is time to start studying ${block.subjectName}${courseText}. Goal: "${block.topic}". Scheduled from ${fmt12h(block.startTime)} to ${fmt12h(block.endTime)}.`;
    
    if (alarmDismissBtn) {
        alarmDismissBtn.innerText = "Start Study / Dismiss";
    }
    
    alarmModal.classList.add("active");
    
    // Sound Loop
    playSpiritualChime('alarm');
    currentAlarmInterval = setInterval(() => {
        playSpiritualChime('alarm');
    }, 4500);

    // Push local notification
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Study Time: ${block.subjectName}`, {
            body: `Goal: ${block.topic}. Scheduled till ${fmt12h(block.endTime)}.`,
            requireInteraction: true
        });
    }
}

// Stop Alarm Chime Loop
function stopRingingAlarm(autoMarkOffered = false) {
    if (currentAlarmInterval) {
        clearInterval(currentAlarmInterval);
        currentAlarmInterval = null;
    }
    
    const alarmModal = document.getElementById("modal-alarm-ringing");
    if (alarmModal) {
        alarmModal.classList.remove("active");
    }

    const alarmDismissBtn = document.getElementById("btn-dismiss-alarm");
    if (alarmDismissBtn) {
        alarmDismissBtn.innerText = "Offered / Dismiss Alarm"; // reset back to default
    }

    if (autoMarkOffered && currentActiveAlarmName) {
        if (currentActiveAlarmType === "study") {
            const block = state.studyBlocks.find(b => b.id === currentActiveAlarmBlockId);
            if (block) {
                block.done = true;
                saveStateToStorage();
                renderScheduleBlocks();
                updateDashboardProgressBars();
                
                playSpiritualChime('success');
                
                // Show Study tab by triggering click
                const navStudTabBtn = document.querySelector(".nav-btn[data-tab='schedule']");
                if (navStudTabBtn) navStudTabBtn.click();
            }
        } else {
            // Toggle prayer offered status in UI and state
            const lowercaseName = currentActiveAlarmName.toLowerCase();
            state.namazStatus[lowercaseName] = true;
            saveStateToStorage();
            updateNamazUI();
            updateDashboardProgressBars();
            
            playSpiritualChime('success');
        }
    }
    
    currentActiveAlarmName = "";
    currentActiveAlarmType = "";
    currentActiveAlarmBlockId = null;
}

// Check time blocks for prayer notifications
function checkPrayerAlarms() {
    const now = new Date();
    const currentHrMin = now.toTimeString().substring(0, 5); // Format "HH:MM"
    
    Object.keys(state.namazAlarmTimes).forEach(prayer => {
        const isAlarmOn = state.namazAlarmSwitches[prayer];
        const scheduledTime = state.namazAlarmTimes[prayer];
        
        if (isAlarmOn && scheduledTime === currentHrMin) {
            // Guard against multiple triggers in the same minute
            const lastChecked = localStorage.getItem(`alarm_last_triggered_${prayer}`);
            const todayStr = now.toDateString();
            
            if (lastChecked !== todayStr) {
                localStorage.setItem(`alarm_last_triggered_${prayer}`, todayStr);
                triggerPrayerAlarm(prayer);
            }
        }
    });
}

// Check time blocks for study notifications
function checkStudyAlarms() {
    const now = new Date();
    const currentHrMin = now.toTimeString().substring(0, 5); // Format "HH:MM"
    
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = daysOfWeek[now.getDay()];
    
    state.studyBlocks.forEach(block => {
        const isAlarmOn = block.alarmEnabled;
        const scheduledDay = block.day || "Monday";
        const scheduledTime = block.startTime;
        
        if (isAlarmOn && scheduledDay === currentDay && scheduledTime === currentHrMin && !block.done) {
            // Guard against multiple triggers in the same minute
            const lastChecked = localStorage.getItem(`study_alarm_last_triggered_${block.id}`);
            const todayStr = now.toDateString();
            
            if (lastChecked !== todayStr) {
                localStorage.setItem(`study_alarm_last_triggered_${block.id}`, todayStr);
                triggerStudyAlarm(block);
            }
        }
    });
}

// -------------------------------------------------------------
// CLOCK, ISLAMIC HIERI DATES & TAB CONTROLLER
// -------------------------------------------------------------
function initClockAndDates() {
    updateNotificationBannerState();
    
    const clockEl = document.getElementById("digital-clock");
    const gregDateEl = document.getElementById("gregorian-date-val");
    const hijriDateEl = document.getElementById("hijri-date-val");

    function renderTime() {
        const now = new Date();
        
        // Digital Clock display
        clockEl.innerText = now.toLocaleTimeString('en-US', {
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
        });

        // Gregorian Date
        gregDateEl.innerText = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Dynamic Hijri Date using native JS Intl Calendar API
        try {
            const formatter = new Intl.DateTimeFormat('en-U-ca-islamic-umalqura', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            hijriDateEl.innerText = formatter.format(now);
        } catch (e) {
            hijriDateEl.innerText = "Hijri Calendar unavailable";
        }
    }

    renderTime();
    setInterval(renderTime, 1000);
}

function initTabNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            // Toggle active sidebar states
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle Tab sheets
            tabPanes.forEach(pane => {
                pane.classList.remove("active");
                if (pane.getAttribute("id") === `tab-${targetTab}`) {
                    pane.classList.add("active");
                }
            });

            // Initialize Audio synthesis context implicitly on navigation interaction
            if (!activeAudioContext) {
                activeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        });
    });
}

// -------------------------------------------------------------
// DYNAMIC SLIDING INSPIRATIONS (Quran Verses & Hadith)
// -------------------------------------------------------------
function initInspirationSlider() {
    const textEl = document.getElementById("inspiration-quote-text");
    const sourceEl = document.getElementById("inspiration-quote-source");
    const nextBtn = document.getElementById("btn-next-inspiration");
    
    let currentIndex = Math.floor(Math.random() * INSPIRATION_DATABASE.length);

    function displayQuote(index) {
        const item = INSPIRATION_DATABASE[index];
        textEl.style.opacity = '0';
        sourceEl.style.opacity = '0';
        
        setTimeout(() => {
            textEl.innerText = `"${item.quote}"`;
            sourceEl.innerText = item.source;
            textEl.style.opacity = '1';
            sourceEl.style.opacity = '1';
        }, 150);
    }

    // Load initial random item
    displayQuote(currentIndex);

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % INSPIRATION_DATABASE.length;
        displayQuote(currentIndex);
    });
}

// -------------------------------------------------------------
// NAMAZ MODULE & ALARMS CONFIGURATION
// -------------------------------------------------------------
function initNamazModule() {
    const alarmOverlay = document.getElementById("modal-alarm-ringing");
    const btnDismiss = document.getElementById("btn-dismiss-alarm");
    const btnSnooze = document.getElementById("btn-snooze-alarm");
    const btnQuickChime = document.getElementById("btn-quick-play-chime");

    // Hook Prayer Check buttons & Alarms Switches
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'tahajjud'];

    prayers.forEach(pr => {
        const card = document.querySelector(`.prayer-card.${pr}`);
        const checkBtn = document.getElementById(`check-btn-${pr}`);
        const alarmTimeInput = document.getElementById(`time-${pr}`);
        const alarmSw = document.getElementById(`alarm-switch-${pr}`);

        // Set inputs based on State cache
        if (state.namazAlarmTimes[pr]) {
            alarmTimeInput.value = state.namazAlarmTimes[pr];
        }
        if (state.namazAlarmSwitches[pr] !== undefined) {
            alarmSw.checked = state.namazAlarmSwitches[pr];
        }
        
        // Mark Completion handler
        checkBtn.addEventListener("click", () => {
            state.namazStatus[pr] = !state.namazStatus[pr];
            saveStateToStorage();
            updateNamazUI();
            updateDashboardProgressBars();
            
            if (state.namazStatus[pr]) {
                playSpiritualChime('success');
            }
        });

        // Time updates handler
        alarmTimeInput.addEventListener("change", (e) => {
            state.namazAlarmTimes[pr] = e.target.value;
            saveStateToStorage();
            updatePrayerCountdown();
        });

        // Alarm toggle handler
        alarmSw.addEventListener("change", (e) => {
            state.namazAlarmSwitches[pr] = e.target.checked;
            saveStateToStorage();
        });
    });

    // Test tone
    btnQuickChime.addEventListener("click", () => {
        playSpiritualChime('alarm');
    });

    // Alarm ring action events
    btnDismiss.addEventListener("click", () => {
        stopRingingAlarm(true);
    });

    btnSnooze.addEventListener("click", () => {
        // Dismiss currently but snooze checked again in 5 minutes
        const typeCopy = currentActiveAlarmType;
        const nameCopy = currentActiveAlarmName;
        const blockIdCopy = currentActiveAlarmBlockId;

        stopRingingAlarm(false);
        
        setTimeout(() => {
            if (typeCopy === "study") {
                const block = state.studyBlocks.find(b => b.id === blockIdCopy);
                if (block) triggerStudyAlarm(block);
            } else if (nameCopy) {
                triggerPrayerAlarm(nameCopy);
            }
        }, 300000); // 5 minutes
    });

    updateNamazUI();
    setInterval(updatePrayerCountdown, 1000);
}

function updateNamazUI() {
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'tahajjud'];
    prayers.forEach(pr => {
        const card = document.querySelector(`.prayer-card.${pr}`);
        if (state.namazStatus[pr]) {
            card.classList.add("completed");
        } else {
            card.classList.remove("completed");
        }
    });
}

// Countdowns timer calculation for upcoming prayer
function updatePrayerCountdown() {
    const now = new Date();
    const sortedPrayers = [];

    const keys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'tahajjud'];
    keys.forEach(k => {
        const timeParts = state.namazAlarmTimes[k].split(":");
        const pDate = new Date(now);
        pDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

        // If time passed today, set upcoming date as tomorrow
        if (pDate < now) {
            pDate.setDate(pDate.getDate() + 1);
        }

        sortedPrayers.push({
            name: k.replace(/^\w/, c => c.toUpperCase()),
            timeStr: state.namazAlarmTimes[k],
            targetTime: pDate
        });
    });

    // Sort prayers chronologically
    sortedPrayers.sort((a, b) => a.targetTime - b.targetTime);
    
    // Nearest prayer
    const nextPr = sortedPrayers[0];
    const diffMs = nextPr.targetTime - now;

    // Convert milliseconds
    const totSec = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totSec / 3600);
    const mins = Math.floor((totSec % 3600) / 60);
    const secs = totSec % 60;

    const timerStr = [
        String(hrs).padStart(2, '0'),
        String(mins).padStart(2, '0'),
        String(secs).padStart(2, '0')
    ].join(":");

    // Update Elements
    document.getElementById("next-prayer-name").innerText = nextPr.name;
    document.getElementById("next-prayer-timer").innerText = timerStr;
    
    // Format Display
    let hrVal = parseInt(nextPr.timeStr.split(":")[0]);
    const minVal = nextPr.timeStr.split(":")[1];
    const ampm = hrVal >= 12 ? 'PM' : 'AM';
    hrVal = hrVal % 12 || 12;
    document.getElementById("next-prayer-timing-label").innerText = `Starts at ${hrVal}:${minVal} ${ampm}`;
}

// -------------------------------------------------------------
// DAILY ROUTINE MODULE (Checklists)
// -------------------------------------------------------------
function initRoutineModule() {
    const listContainer = document.getElementById("dashboard-routine-list");
    const openAddBtn = document.getElementById("btn-add-routine-modal");
    const closeOverlay = document.getElementById("btn-close-routine-modal");
    const cancelModal = document.getElementById("btn-cancel-routine-modal");
    const saveTaskBtn = document.getElementById("btn-save-routine-task");
    const modalOverlay = document.getElementById("modal-add-routine");

    function renderTasks() {
        listContainer.innerHTML = "";
        
        state.routineTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `checklist-item ${task.completed ? 'finished' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" id="task-chk-${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task done">
                <label for="task-chk-${task.id}">${task.name} <span class="text-muted" style="font-size:0.75rem;">(${task.category})</span></label>
                <button class="btn btn-secondary-danger btn-sm delete-btn" data-id="${task.id}" style="padding: 2px 8px; font-size:10px; margin-left:auto;">✕</button>
            `;

            // Toggle selection logic
            const chk = li.querySelector(`input[type="checkbox"]`);
            chk.addEventListener("change", () => {
                task.completed = chk.checked;
                if (chk.checked) {
                    li.classList.add("finished");
                    playSpiritualChime('success');
                } else {
                    li.classList.remove("finished");
                }
                saveStateToStorage();
                updateDashboardProgressBars();
            });

            // Delete logic
            li.querySelector(".delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                state.routineTasks = state.routineTasks.filter(t => t.id !== task.id);
                saveStateToStorage();
                renderTasks();
                updateDashboardProgressBars();
            });

            listContainer.appendChild(li);
        });
    }

    // Modal Control handles
    openAddBtn.addEventListener("click", () => modalOverlay.classList.add("active"));
    closeOverlay.addEventListener("click", () => modalOverlay.classList.remove("active"));
    cancelModal.addEventListener("click", () => modalOverlay.classList.remove("active"));
    
    saveTaskBtn.addEventListener("click", () => {
        const nameVal = document.getElementById("input-routine-task-name").value.trim();
        const catVal = document.getElementById("select-routine-category").value;

        if (nameVal) {
            const newTask = {
                id: Date.now(),
                name: nameVal,
                category: catVal,
                completed: false
            };
            state.routineTasks.push(newTask);
            saveStateToStorage();
            renderTasks();
            updateDashboardProgressBars();
            
            // Clean & Hide
            document.getElementById("input-routine-task-name").value = "";
            modalOverlay.classList.remove("active");
        }
    });

    renderTasks();
}

// -------------------------------------------------------------
// STUDY MODULE — SUBJECT LIBRARY + DAY SCHEDULER
// -------------------------------------------------------------

let selectedScheduleSubjectId = null;  // currently-picked subject pill
let selectedStudyBlockDay = "Monday";  // selected day for scheduler
let currentDisplayDayFilter = "All";  // current filter tabs display day

function initStudyModule() {
    // Make sure state.courses is initialized
    if (!state.courses) {
        state.courses = [
            { id: 301, name: "DIT", desc: "Diploma in Information Technology" },
            { id: 302, name: "Islamic Studies", desc: "Spiritual and Academic courses" }
        ];
        saveStateToStorage();
    }

    // -------- Color Swatch Picker --------
    const swatches = document.querySelectorAll('#subject-color-swatches .color-swatch');
    let pickedColor = '#5b8dee'; // default blue

    swatches.forEach(sw => {
        sw.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('picked'));
            sw.classList.add('picked');
            pickedColor = sw.getAttribute('data-color');
        });
    });

    // -------- Course Add Handler --------
    const btnAddCourse = document.getElementById('btn-add-new-course');
    if (btnAddCourse) {
        btnAddCourse.addEventListener('click', () => {
            const courseNameInput = document.getElementById('input-new-course-name');
            const courseDescInput = document.getElementById('input-new-course-desc');
            const name = courseNameInput.value.trim();
            const desc = courseDescInput.value.trim();

            if (!name) {
                courseNameInput.focus();
                courseNameInput.style.borderColor = 'var(--red-danger)';
                setTimeout(() => courseNameInput.style.borderColor = '', 1200);
                return;
            }

            const newCourse = {
                id: Date.now(),
                name: name,
                desc: desc
            };

            state.courses.push(newCourse);
            saveStateToStorage();
            renderCourseLibrary();
            renderCourseSelectDropdown();

            courseNameInput.value = '';
            courseDescInput.value = '';
            playSpiritualChime('success');
        });
    }

    // -------- Subject Add Handler --------
    const btnAddSubject = document.getElementById('btn-add-new-subject');
    btnAddSubject.addEventListener('click', () => {
        const nameEl = document.getElementById('input-new-subject-name');
        const descEl = document.getElementById('input-new-subject-desc');
        const courseSelect = document.getElementById('select-subject-course');
        
        const name = nameEl.value.trim();
        const desc = descEl.value.trim();
        const courseId = parseInt(courseSelect.value);

        if (!name) {
            nameEl.focus();
            nameEl.style.borderColor = 'var(--red-danger)';
            setTimeout(() => nameEl.style.borderColor = '', 1200);
            return;
        }

        if (!courseId) {
            alert('Please select a school Course (e.g. DIT) to link this subject to.');
            courseSelect.focus();
            return;
        }

        const newSubject = {
            id: Date.now(),
            courseId: courseId,
            name: name,
            desc: desc,
            color: pickedColor
        };

        state.subjects.push(newSubject);
        saveStateToStorage();
        renderSubjectLibrary();
        renderSubjectPills();

        nameEl.value = '';
        descEl.value = '';
        playSpiritualChime('success');
    });

    // -------- Study Day Swatches Picker --------
    const dayBadges = document.querySelectorAll('#schedule-day-swatches .preset-badge');
    dayBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            dayBadges.forEach(b => b.classList.remove('selected'));
            badge.classList.add('selected');
            selectedStudyBlockDay = badge.getAttribute('data-day');
        });
    });

    // -------- Study Agenda Day Filtering Tabs --------
    const filterTabs = document.querySelectorAll('#day-filter-tabs button');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDisplayDayFilter = tab.getAttribute('data-filter');
            renderScheduleBlocks();
        });
    });

    // -------- Clear Study Schedule --------
    document.getElementById('btn-clear-study-schedule').addEventListener('click', () => {
        if (state.studyBlocks.length === 0) return;
        if (confirm('Clear all schedule blocks? This will delete all study slots across all days.')) {
            state.studyBlocks = [];
            saveStateToStorage();
            renderScheduleBlocks();
            updateDashboardProgressBars();
        }
    });

    // -------- Add Timetable Agenda Block --------
    document.getElementById('btn-add-schedule-block').addEventListener('click', () => {
        if (!selectedScheduleSubjectId) {
            alert('Please select a subject first (click a pill in step 1).');
            return;
        }
        const subject = state.subjects.find(s => s.id === selectedScheduleSubjectId);
        if (!subject) return;

        const start = document.getElementById('sched-start').value;
        const end = document.getElementById('sched-end').value;
        const topic = document.getElementById('sched-topic').value.trim();
        const alarmEnabled = document.getElementById('sched-alarm-active').checked;

        if (!start || !end) {
            alert('Please set both start and end times.');
            return;
        }

        const block = {
            id: Date.now(),
            courseId: subject.courseId,
            subjectId: subject.id,
            subjectName: subject.name,
            subjectColor: subject.color,
            day: selectedStudyBlockDay,
            startTime: start,
            endTime: end,
            alarmEnabled: alarmEnabled,
            topic: topic || 'General study session',
            done: false
        };

        state.studyBlocks.push(block);
        saveStateToStorage();
        renderScheduleBlocks();
        updateDashboardProgressBars();

        // Clear input info
        document.getElementById('sched-topic').value = '';
        playSpiritualChime('success');
    });

    // Initial renders
    renderCourseLibrary();
    renderCourseSelectDropdown();
    renderSubjectLibrary();
    renderSubjectPills();
    renderScheduleBlocks();
}

// Render courses in the library panel
function renderCourseLibrary() {
    const list = document.getElementById('courses-library-list');
    const emptyMsg = document.getElementById('empty-courses-msg');
    const countLbl = document.getElementById('courses-count-label');
    if (!list || !countLbl || !emptyMsg) return;

    // Clear existing chips
    list.querySelectorAll('.subject-chip').forEach(el => el.remove());

    const count = state.courses ? state.courses.length : 0;
    countLbl.textContent = `${count} course${count !== 1 ? 's' : ''}`;

    if (count === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    }
    emptyMsg.classList.add('hidden');

    state.courses.forEach(course => {
        const chip = document.createElement('div');
        chip.className = 'subject-chip';
        chip.innerHTML = `
            <div class="subject-color-dot" style="background:var(--gold)"></div>
            <div style="flex-grow:1;min-width:0;">
                <div class="subject-chip-name">${course.name}</div>
                ${course.desc ? `<div class="subject-chip-desc">${course.desc}</div>` : ''}
            </div>
            <button class="subject-chip-del" data-id="${course.id}" title="Remove course">✕</button>
        `;
        chip.querySelector('.subject-chip-del').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Deleting "${course.name}" will remove all subjects and schedule slots linked to it. Continue?`)) {
                state.courses = state.courses.filter(c => c.id !== course.id);
                // Also clean subjects and blocks linked
                state.subjects = state.subjects.filter(s => s.courseId !== course.id);
                state.studyBlocks = state.studyBlocks.filter(b => b.courseId !== course.id);
                
                if (selectedScheduleSubjectId) {
                    const activeSubj = state.subjects.find(s => s.id === selectedScheduleSubjectId);
                    if (!activeSubj) selectedScheduleSubjectId = null;
                }

                saveStateToStorage();
                renderCourseLibrary();
                renderCourseSelectDropdown();
                renderSubjectLibrary();
                renderSubjectPills();
                renderScheduleBlocks();
                updateDashboardProgressBars();
            }
        });
        list.appendChild(chip);
    });
}

// Populate dropdown
function renderCourseSelectDropdown() {
    const select = document.getElementById('select-subject-course');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select Course --</option>';

    if (state.courses) {
        state.courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            select.appendChild(option);
        });
        if (state.courses.length > 0) {
            // Select first course as default
            select.value = state.courses[0].id;
        }
    }
}

// Render subject chips in the library panel
function renderSubjectLibrary() {
    const list = document.getElementById('subject-library-list');
    const emptyMsg = document.getElementById('empty-subjects-msg');
    const countLbl = document.getElementById('subject-count-label');
    if (!list || !countLbl || !emptyMsg) return;

    // Clear existing chips
    list.querySelectorAll('.subject-chip').forEach(el => el.remove());

    const count = state.subjects.length;
    countLbl.textContent = `${count} subject${count !== 1 ? 's' : ''}`;

    if (count === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    }
    emptyMsg.classList.add('hidden');

    state.subjects.forEach(subj => {
        const course = state.courses ? state.courses.find(c => c.id === subj.courseId) : null;
        const courseLabel = course ? ` [${course.name}]` : '';

        const chip = document.createElement('div');
        chip.className = 'subject-chip';
        chip.innerHTML = `
            <div class="subject-color-dot" style="background:${subj.color}"></div>
            <div style="flex-grow:1;min-width:0;">
                <div class="subject-chip-name">${subj.name}<span style="color:var(--gold); font-size:0.75rem;">${courseLabel}</span></div>
                ${subj.desc ? `<div class="subject-chip-desc">${subj.desc}</div>` : ''}
            </div>
            <button class="subject-chip-del" data-id="${subj.id}" title="Remove subject">✕</button>
        `;
        chip.querySelector('.subject-chip-del').addEventListener('click', () => {
            state.subjects = state.subjects.filter(s => s.id !== subj.id);
            // Also remove related schedule blocks
            state.studyBlocks = state.studyBlocks.filter(b => b.subjectId !== subj.id);
            if (selectedScheduleSubjectId === subj.id) selectedScheduleSubjectId = null;
            saveStateToStorage();
            renderSubjectLibrary();
            renderSubjectPills();
            renderScheduleBlocks();
            updateDashboardProgressBars();
        });
        list.appendChild(chip);
    });
}

// Render clickable subject pills in the scheduler
function renderSubjectPills() {
    const grid = document.getElementById('subject-select-grid');
    const emptyMsg = document.getElementById('empty-subject-pills-msg');
    if (!grid || !emptyMsg) return;

    grid.querySelectorAll('.subject-select-pill').forEach(el => el.remove());

    if (state.subjects.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    }
    emptyMsg.classList.add('hidden');

    state.subjects.forEach(subj => {
        const course = state.courses ? state.courses.find(c => c.id === subj.courseId) : null;
        const label = course ? `${subj.name} (${course.name})` : subj.name;

        const pill = document.createElement('button');
        pill.className = 'subject-select-pill' + (selectedScheduleSubjectId === subj.id ? ' selected' : '');
        pill.setAttribute('data-id', subj.id);
        pill.innerHTML = `<span class="pill-dot" style="background:${subj.color}"></span>${label}`;
        pill.addEventListener('click', () => {
            selectedScheduleSubjectId = subj.id;
            renderSubjectPills(); // re-render to reflect selection
        });
        grid.appendChild(pill);
    });
}

// Render the schedule blocks list
function renderScheduleBlocks() {
    const container = document.getElementById('schedule-agenda-container');
    const emptyMsg = document.getElementById('empty-schedule-msg');
    if (!container || !emptyMsg) return;

    container.querySelectorAll('.schedule-block-card').forEach(el => el.remove());

    if (state.studyBlocks.length === 0) {
        emptyMsg.classList.remove('hidden');
        updateDashboardProgressBars();
        return;
    }
    emptyMsg.classList.add('hidden');

    // Filter by Display day
    let blocksToDraw = state.studyBlocks;
    if (currentDisplayDayFilter !== "All") {
        blocksToDraw = state.studyBlocks.filter(b => b.day === currentDisplayDayFilter);
    }

    if (blocksToDraw.length === 0) {
        emptyMsg.classList.remove('hidden');
        emptyMsg.textContent = `No scheduled blocks for ${currentDisplayDayFilter}.`;
        updateDashboardProgressBars();
        return;
    }
    emptyMsg.classList.add('hidden');
    emptyMsg.textContent = "No blocks yet. Pick a course, subject, day/time, and add a study block.";

    // Sort by start time
    const sorted = [...blocksToDraw].sort((a, b) => a.startTime.localeCompare(b.startTime));

    sorted.forEach(block => {
        const card = document.createElement('div');
        card.className = 'schedule-block-card' + (block.done ? ' done' : '');
        card.style.borderLeftColor = block.subjectColor;

        const startFmt = fmt12h(block.startTime);
        const endFmt = fmt12h(block.endTime);
        const dayLabel = currentDisplayDayFilter === "All" ? ` (${block.day || 'Mon'})` : '';

        const course = state.courses ? state.courses.find(c => c.id === block.courseId) : null;
        const courseName = course ? ` [${course.name}]` : '';

        const alarmColor = block.alarmEnabled ? 'var(--gold)' : 'var(--text-muted)';
        const alarmIcon = block.alarmEnabled ? '🔔 Alarm On' : '🔕 Alarm Off';

        card.innerHTML = `
            <div class="schedule-block-time-badge">${startFmt} – ${endFmt}${dayLabel}</div>
            <div class="schedule-block-info" style="margin-left: 8px;">
                <div class="schedule-block-subject">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${block.subjectColor};margin-right:6px;"></span>
                    ${block.subjectName}<span style="color:var(--gold); font-size:0.72rem;">${courseName}</span>
                </div>
                <div class="schedule-block-topic">${block.topic}</div>
            </div>
            <div class="schedule-block-actions">
                <button class="sba-btn alarm-toggle-btn" title="Toggle Alarm" style="color: ${alarmColor}; border-color: ${block.alarmEnabled ? 'rgba(212, 175, 55, 0.3)' : 'var(--border-glass)'};">
                    ${alarmIcon}
                </button>
                <button class="sba-btn done-btn" title="${block.done ? 'Undo' : 'Mark done'}">${block.done ? '↩ Study' : '✓ Done'}</button>
                <button class="sba-btn del-btn" title="Delete">✕</button>
            </div>
        `;

        // Toggle alarm
        card.querySelector('.alarm-toggle-btn').addEventListener('click', () => {
            block.alarmEnabled = !block.alarmEnabled;
            saveStateToStorage();
            renderScheduleBlocks();
        });

        // Toggle done
        card.querySelector('.done-btn').addEventListener('click', () => {
            block.done = !block.done;
            saveStateToStorage();
            renderScheduleBlocks();
            updateDashboardProgressBars();
            if (block.done) playSpiritualChime('success');
        });

        // Delete
        card.querySelector('.del-btn').addEventListener('click', () => {
            state.studyBlocks = state.studyBlocks.filter(b => b.id !== block.id);
            saveStateToStorage();
            renderScheduleBlocks();
            updateDashboardProgressBars();
        });

        container.appendChild(card);
    });

    updateDashboardProgressBars();
}

function fmt12h(timeStr) {
    if (!timeStr) return '';
    let h = parseInt(timeStr.split(':')[0]);
    const m = timeStr.split(':')[1];
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
}

// -------------------------------------------------------------
// POMODORO FOCUS STATION TIMER
// -------------------------------------------------------------
function initPomodoroModule() {
    const display = document.getElementById("pomodoro-display");
    const progressRing = document.getElementById("pomodoro-progress-bar");
    const btnStart = document.getElementById("btn-pomo-start");
    const btnPause = document.getElementById("btn-pomo-pause");
    const btnReset = document.getElementById("btn-pomo-reset");
    const modes = document.querySelectorAll(".timer-mode-selection button");

    const ringCircumference = 502; // stroke-dasharray value (2 * math.pi * r)

    function updatePomoTimerDisplay() {
        const mins = Math.floor(pomoTimerRemaining / 60);
        const secs = pomoTimerRemaining % 60;
        display.innerText = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        
        // Radial SVG offset calculate
        const progressFrac = pomoTimerRemaining / pomoTimerDuration;
        const offset = ringCircumference - (progressFrac * ringCircumference);
        progressRing.style.strokeDashoffset = offset;
    }

    function startPomoTimer() {
        if (pomoTimerIsRunning) return;
        pomoTimerIsRunning = true;
        btnStart.classList.add("hidden");
        
        pomoTimerInterval = setInterval(() => {
            if (pomoTimerRemaining > 0) {
                pomoTimerRemaining--;
                updatePomoTimerDisplay();
            } else {
                clearInterval(pomoTimerInterval);
                pomoTimerIsRunning = false;
                btnStart.classList.remove("hidden");
                
                // Ring success Synthesizer sound trigger
                playSpiritualChime('success');
                
                setTimeout(() => {
                    alert("Focus session completed successfully! Keep striving.");
                }, 500);

                // Auto append completed routine score
                const studyScore = document.getElementById("text-study-score");
                studyScore.innerText = "100%";
            }
        }, 1000);
    }

    function pausePomoTimer() {
        clearInterval(pomoTimerInterval);
        pomoTimerIsRunning = false;
        btnStart.classList.remove("hidden");
    }

    function resetPomoTimer() {
        clearInterval(pomoTimerInterval);
        pomoTimerIsRunning = false;
        btnStart.classList.remove("hidden");
        pomoTimerRemaining = pomoTimerDuration;
        updatePomoTimerDisplay();
    }

    modes.forEach(modeBtn => {
        modeBtn.addEventListener("click", () => {
            // Remove active style from mode selections
            modes.forEach(m => m.classList.remove("active"));
            modeBtn.classList.add("active");
            
            const durationMins = parseInt(modeBtn.getAttribute("data-duration"));
            pomoTimerDuration = durationMins * 60;
            pomoTimerRemaining = pomoTimerDuration;
            
            // Adjust ring border glow color
            if (durationMins === 25) {
                progressRing.style.stroke = "var(--gold)";
            } else {
                progressRing.style.stroke = "var(--emerald)";
            }

            resetPomoTimer();
        });
    });

    btnStart.addEventListener("click", startPomoTimer);
    btnPause.addEventListener("click", pausePomoTimer);
    btnReset.addEventListener("click", resetPomoTimer);
    
    updatePomoTimerDisplay(); // Initial load
}

// -------------------------------------------------------------
// AHTISAAB PORTAL (MORNING INTENTIONS & EVENING LAWS)
// -------------------------------------------------------------
function initAhtisaabModule() {
    const focusInput = document.getElementById("input-custom-sin-focus");
    const saveResolutionBtn = document.getElementById("btn-save-morning-focus");
    const resetResolutionBtn = document.getElementById("btn-reset-resolution");
    const entryArea = document.getElementById("morning-focus-entry-area");
    const activeArea = document.getElementById("morning-focus-active-area");
    const presetBadges = document.querySelectorAll("#sin-presets .preset-badge");
    const activeLabel = document.getElementById("active-sin-name");
    const ahtisaabPledgeLabel = document.getElementById("ahtisaab-pledge-sin-name");

    // Morning Resolution input clicks
    presetBadges.forEach(badge => {
        badge.addEventListener("click", () => {
            presetBadges.forEach(b => b.classList.remove("selected"));
            badge.classList.add("selected");
            focusInput.value = badge.getAttribute("data-sin");
        });
    });

    saveResolutionBtn.addEventListener("click", () => {
        const inputVal = focusInput.value.trim();
        if (inputVal) {
            state.morningSinFocus = inputVal;
            saveStateToStorage();
            renderMorningResolutionCard();
            playSpiritualChime('success');
        }
    });

    resetResolutionBtn.addEventListener("click", () => {
        state.morningSinFocus = "";
        saveStateToStorage();
        renderMorningResolutionCard();
    });

    function renderMorningResolutionCard() {
        if (state.morningSinFocus) {
            activeLabel.innerText = state.morningSinFocus;
            ahtisaabPledgeLabel.innerText = `Avoid: ${state.morningSinFocus}`;
            entryArea.classList.add("hidden");
            activeArea.classList.remove("hidden");
        } else {
            entryArea.classList.remove("hidden");
            activeArea.classList.add("hidden");
            ahtisaabPledgeLabel.innerText = "No morning resolution set yet. Head to the Dashboard!";
            focusInput.value = "";
            presetBadges.forEach(b => b.classList.remove("selected"));
        }
    }

    // Ahtisaab accountability Yes/No buttons
    const btnYes = document.getElementById("btn-ahtisaab-avoided-yes");
    const btnNo = document.getElementById("btn-ahtisaab-avoided-no");

    btnYes.addEventListener("click", () => {
        state.ahtisaabStatusToday = "yes";
        btnYes.classList.add("active");
        btnNo.classList.remove("active");
        playSpiritualChime('success');
    });

    btnNo.addEventListener("click", () => {
        state.ahtisaabStatusToday = "no";
        btnNo.classList.add("active");
        btnYes.classList.remove("active");
        playSpiritualChime('alarm');
    });

    // Custom badges checker inside Ahtisaab checklist
    const btnAppendCustomSin = document.getElementById("btn-add-ahtisaab-custom-sin-badge");
    const customSinInput = document.getElementById("input-ahtisaab-custom-sin");
    const sinsChContainer = document.getElementById("ahtisaab-sins-checkboxes");

    btnAppendCustomSin.addEventListener("click", () => {
        const val = customSinInput.value.trim();
        if (val) {
            const safeId = "custom-ch-" + Date.now();
            const label = document.createElement("label");
            label.className = "sin-checkbox-container";
            label.setAttribute("for", safeId);
            
            label.innerHTML = `
                <input type="checkbox" id="${safeId}" value="${val}" checked> ${val}
            `;
            sinsChContainer.appendChild(label);
            customSinInput.value = "";
            playSpiritualChime('tick');
        }
    });

    // Istighfar Tasbih Counter
    const istighfarClicker = document.getElementById("btn-tap-istighfar");
    const totalCountLabel = document.getElementById("istighfar-total-count");

    totalCountLabel.innerText = state.istighfarToday;

    istighfarClicker.addEventListener("click", () => {
        state.istighfarToday++;
        totalCountLabel.innerText = state.istighfarToday;
        saveStateToStorage();
        playSpiritualChime('tick');
    });

    // Ahtisaab Submit Reflection
    const submitBtn = document.getElementById("btn-submit-ahtisaab");
    const successModal = document.getElementById("modal-reflection-success");
    const successModalClose = document.getElementById("btn-close-success-modal");

    submitBtn.addEventListener("click", () => {
        if (!state.ahtisaabStatusToday) {
            alert("Please evaluate your targeted Resolution focus (Click Yes/No) before submitting.");
            return;
        }

        // Fetch other sins selected
        const checkedSinsVal = [];
        const checkedBoxes = sinsChContainer.querySelectorAll("input[type='checkbox']:checked");
        checkedBoxes.forEach(ch => {
            checkedSinsVal.push(ch.value);
        });

        const reflectionText = document.getElementById("textarea-ahtisaab-journal").value.trim();
        
        // Log transaction data
        const logEntry = {
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            resolvedSin: state.morningSinFocus || "None",
            status: state.ahtisaabStatusToday,
            extraSins: checkedSinsVal,
            istighfarCount: state.istighfarToday,
            journal: reflectionText || "No notes logged.",
            timestamp: Date.now()
        };

        // Append & Keep top 10
        state.ahtisaabHistory.unshift(logEntry);
        if (state.ahtisaabHistory.length > 10) {
            state.ahtisaabHistory.pop();
        }

        // Reset today's temporary inputs
        state.istighfarToday = 0;
        state.ahtisaabStatusToday = null;
        totalCountLabel.innerText = "0";
        document.getElementById("textarea-ahtisaab-journal").value = "";
        btnYes.classList.remove("active");
        btnNo.classList.remove("active");
        
        // Uncheck boxes
        sinsChContainer.querySelectorAll("input[type='checkbox']").forEach(ch => {
            ch.checked = false;
        });

        // Save
        saveStateToStorage();
        renderHistoryFeed();
        updateDashboardProgressBars();
        
        // Play congratulations tone
        playSpiritualChime('success');

        // Show Success Dialogue Modals
        successModal.classList.add("active");
    });

    successModalClose.addEventListener("click", () => {
        successModal.classList.remove("active");
    });

    function renderHistoryFeed() {
        const feedContainer = document.getElementById("ahtisaab-history-feed-list");
        const placeholder = document.getElementById("placeholder-history-ahtisaab");

        // Clear previous feeds except placeholder
        const items = feedContainer.querySelectorAll(".history-feed-item");
        items.forEach(it => it.remove());

        if (state.ahtisaabHistory.length === 0) {
            placeholder.classList.remove("hidden");
            return;
        }

        placeholder.classList.add("hidden");

        state.ahtisaabHistory.forEach(log => {
            const card = document.createElement("div");
            card.className = "history-feed-item";
            
            const isSuccess = log.status === 'yes';
            const badgeClass = isSuccess ? 'avoided' : 'failed';
            const badgeText = isSuccess ? 'Avoided target' : 'Faltered target';
            
            card.innerHTML = `
                <div class="history-item-header flex-space">
                    <span class="history-date">${log.date}</span>
                    <span class="history-status-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="history-body-details">
                    <p><strong>Goal Resolution:</strong> <span class="text-gold">${log.resolvedSin}</span></p>
                    ${log.extraSins.length > 0 ? `<p><strong>Other habits to subtract:</strong> ${log.extraSins.join(", ")}</p>` : ''}
                    <p style="margin-top:6px;"><strong>Istighfar Recited:</strong> ${log.istighfarCount} times</p>
                    <p style="font-style:italic; margin-top:8px; color:var(--text-muted);">"${log.journal}"</p>
                </div>
            `;
            
            feedContainer.appendChild(card);
        });
    }

    renderMorningResolutionCard();
    renderHistoryFeed();
}

// -------------------------------------------------------------
// PROGRESS METRICS CALCULATION (DASHBOARD HUB)
// -------------------------------------------------------------
function updateDashboardProgressBars() {
    // 1. Namaz Score percentage calculate
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let countNamaz = 0;
    prayers.forEach(pr => {
        if (state.namazStatus[pr]) countNamaz++;
    });

    const scoreLabel = document.getElementById("text-namaz-score");
    scoreLabel.innerText = `${countNamaz}/5`;

    const namazRing = document.getElementById("ring-namaz-bar");
    setCircleRingProgress(namazRing, countNamaz / 5);

    // 2. Study Agenda Completion
    const studyRing = document.getElementById("ring-study-bar");
    const studyLabel = document.getElementById("text-study-score");
    
    if (state.studyBlocks.length === 0) {
        studyLabel.innerText = "0%";
        setCircleRingProgress(studyRing, 0);
    } else {
        let completedStudy = 0;
        state.studyBlocks.forEach(sb => {
            if (sb.done || sb.completed) completedStudy++;  // support both old & new field
        });
        const pct = Math.round((completedStudy / state.studyBlocks.length) * 100);
        studyLabel.innerText = `${pct}%`;
        setCircleRingProgress(studyRing, completedStudy / state.studyBlocks.length);
    }

    // 3. Daily Routine Tasks progress
    const routineRing = document.getElementById("ring-routine-bar");
    const routineLabel = document.getElementById("text-routine-score");

    if (state.routineTasks.length === 0) {
        routineLabel.innerText = "0%";
        setCircleRingProgress(routineRing, 0);
    } else {
        let completedTasks = 0;
        state.routineTasks.forEach(t => {
            if (t.completed) completedTasks++;
        });
        const pct = Math.round((completedTasks / state.routineTasks.length) * 100);
        routineLabel.innerText = `${pct}%`;
        setCircleRingProgress(routineRing, completedTasks / state.routineTasks.length);
    }
}

// Circular progress SVG logic
function setCircleRingProgress(circleEl, fraction) {
    if (!circleEl) return;
    
    const r = circleEl.r.baseVal.value;
    const circumference = 2 * Math.PI * r;
    
    // Ensure boundaries
    const safeFraction = Math.max(0, Math.min(1, fraction));
    const offset = circumference - (safeFraction * circumference);
    
    circleEl.style.strokeDasharray = `${circumference} ${circumference}`;
    circleEl.style.strokeDashoffset = offset;
}

// Run initially to populate progress boxes
setTimeout(() => {
    updateDashboardProgressBars();
}, 200);
