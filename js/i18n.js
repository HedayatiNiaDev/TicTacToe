// ---------- Translations ----------
const translations = {
    en: {
        brand: "Tic Tac Toe",
        heroTitle1: "Tic Tac Toe",
        heroDesc: "Pick a mode, make your move, and enjoy the game.",
        singlePlayer: "Single Player",
        twoPlayersTitle: "Two Players",
        easy: "Easy",
        easyDesc: "Relaxed opponent",
        medium: "Medium",
        mediumDesc: "Smart opponent",
        impossible: "Impossible",
        impossibleDesc: "Minimax AI",
        playWithFriend: "Play with a Friend (Offline)",
        symbolIs: "Symbol is {symbol}",
        switchTo: "→ switch to {symbol}",
        resetGame: "Reset Game",
        newGame: "New Game",
        player: "Player",
        you: "You",
        robot: "Robot",
        player1: "Player1",
        player2: "Player2",
        statusSingle: "Single Player ({difficulty})",
        statusTwo: "Two Players",
        github: "GitHub",
        notSupport: "Your screen size is not supported",
        language: "Language",
        changeLanguage: "Change language"
    },
    fa: {
        brand: "دوز",
        heroTitle1: "بازی دوز",
        heroDesc: "یک حالت رو انتخاب کن، حرکتت رو بزن و از بازی لذت ببر.",
        singlePlayer: "تک‌نفره",
        twoPlayersTitle: "دو نفره",
        easy: "آسان",
        easyDesc: "حریف آرام",
        medium: "متوسط",
        mediumDesc: "حریف باهوش",
        impossible: "غیرممکن",
        impossibleDesc: "هوش مصنوعی مینیمکس",
        playWithFriend: "بازی با یک دوست (آفلاین)",
        symbolIs: "نماد تو {symbol} است",
        switchTo: "← تغییر به {symbol}",
        resetGame: "شروع دوباره",
        newGame: "بازی جدید",
        player: "بازیکن",
        you: "شما",
        robot: "ربات",
        player1: "بازیکن ۱",
        player2: "بازیکن ۲",
        statusSingle: "تک‌نفره ({difficulty})",
        statusTwo: "دو نفره",
        github: "گیت‌هاب",
        notSupport: "اندازه‌ی صفحه‌نمایش شما پشتیبانی نمی‌شود",
        language: "زبان",
        changeLanguage: "تغییر زبان"
    },
    ar: {
        brand: "إكس أو",
        heroTitle1: "إكس أو",
        heroDesc: "اختر نمطًا، قم بحركتك، واستمتع باللعبة.",
        singlePlayer: "لاعب واحد",
        twoPlayersTitle: "لاعبان",
        easy: "سهل",
        easyDesc: "خصم هادئ",
        medium: "متوسط",
        mediumDesc: "خصم ذكي",
        impossible: "مستحيل",
        impossibleDesc: "ذكاء اصطناعي مينيماكس",
        playWithFriend: "العب مع صديق (بدون اتصال)",
        symbolIs: "رمزك هو {symbol}",
        switchTo: "← التبديل إلى {symbol}",
        resetGame: "إعادة اللعبة",
        newGame: "لعبة جديدة",
        player: "لاعب",
        you: "أنت",
        robot: "الروبوت",
        player1: "اللاعب ١",
        player2: "اللاعب ٢",
        statusSingle: "لاعب واحد ({difficulty})",
        statusTwo: "لاعبان",
        github: "جيت‌هاب",
        notSupport: "حجم الشاشة غير مدعوم",
        language: "اللغة",
        changeLanguage: "تغيير اللغة"
    },
    es: {
        brand: "Tres en Raya",
        heroTitle1: "Tres en Raya",
        heroDesc: "Elige un modo, haz tu jugada y disfruta del juego.",
        singlePlayer: "Un Jugador",
        twoPlayersTitle: "Dos Jugadores",
        easy: "Fácil",
        easyDesc: "Oponente relajado",
        medium: "Medio",
        mediumDesc: "Oponente inteligente",
        impossible: "Imposible",
        impossibleDesc: "IA Minimax",
        playWithFriend: "Jugar con un Amigo (Sin conexión)",
        symbolIs: "Tu símbolo es {symbol}",
        switchTo: "→ cambiar a {symbol}",
        resetGame: "Reiniciar Juego",
        newGame: "Nuevo Juego",
        player: "Jugador",
        you: "Tú",
        robot: "Robot",
        player1: "Jugador1",
        player2: "Jugador2",
        statusSingle: "Un Jugador ({difficulty})",
        statusTwo: "Dos Jugadores",
        github: "GitHub",
        notSupport: "El tamaño de tu pantalla no es compatible",
        language: "Idioma",
        changeLanguage: "Cambiar idioma"
    },
    fr: {
        brand: "Morpion",
        heroTitle1: "Morpion",
        heroDesc: "Choisissez un mode, jouez votre coup et profitez du jeu.",
        singlePlayer: "Un Joueur",
        twoPlayersTitle: "Deux Joueurs",
        easy: "Facile",
        easyDesc: "Adversaire détendu",
        medium: "Moyen",
        mediumDesc: "Adversaire intelligent",
        impossible: "Impossible",
        impossibleDesc: "IA Minimax",
        playWithFriend: "Jouer avec un Ami (Hors ligne)",
        symbolIs: "Votre symbole est {symbol}",
        switchTo: "→ passer à {symbol}",
        resetGame: "Réinitialiser",
        newGame: "Nouvelle Partie",
        player: "Joueur",
        you: "Vous",
        robot: "Robot",
        player1: "Joueur1",
        player2: "Joueur2",
        statusSingle: "Un Joueur ({difficulty})",
        statusTwo: "Deux Joueurs",
        github: "GitHub",
        notSupport: "La taille de votre écran n'est pas prise en charge",
        language: "Langue",
        changeLanguage: "Changer de langue"
    }
};

const langMeta = {
    en: { name: "English", dir: "ltr" },
    fa: { name: "فارسی", dir: "rtl" },
    ar: { name: "العربية", dir: "rtl" },
    es: { name: "Español", dir: "ltr" },
    fr: { name: "Français", dir: "ltr" }
};

// The difficulty key ('Easy'/'Medium'/'Impossible') is stored internally in English
// regardless of UI language, so we map it to a translation key for display.
const difficultyKeyMap = { Easy: "easy", Medium: "medium", Impossible: "impossible" };

function detectInitialLang() {
    const saved = localStorage.getItem("lang");
    if (saved && translations[saved]) return saved;
    const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (translations[browserLang]) return browserLang;
    return "en";
}

let currentLang = detectInitialLang();

function t(key, vars) {
    let str = (translations[currentLang] && translations[currentLang][key])
        || translations.en[key]
        || key;
    if (vars) {
        Object.keys(vars).forEach(k => {
            str = str.replace(`{${k}}`, vars[k]);
        });
    }
    return str;
}

function translatedDifficulty(difficulty) {
    const key = difficultyKeyMap[difficulty];
    return key ? t(key) : difficulty;
}

function applyStaticTranslations() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = langMeta[currentLang].dir;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.getAttribute("data-i18n"));
    });
}

function buildLanguageSwitcher() {
    const wrap = document.createElement("div");
    wrap.className = "lang-switcher";
    wrap.innerHTML = `
        <button id="langToggle" class="lang-toggle" aria-haspopup="true" aria-expanded="false" data-i18n="change_language" aria-label="Change language">
            <i class="bi bi-translate"></i><span id="langCurrent"></span>
        </button>
        <div id="langMenu" class="lang-menu" role="menu"></div>
    `;
    const topbar = document.querySelector(".topbar");
    topbar.insertBefore(wrap, document.querySelector(".github-link"));

    const menu = wrap.querySelector("#langMenu");
    Object.keys(langMeta).forEach(code => {
        const item = document.createElement("button");
        item.className = "lang-option";
        item.setAttribute("data-lang", code);
        item.textContent = langMeta[code].name;
        item.addEventListener("click", () => {
            setLang(code);
            wrap.classList.remove("open");
        });
        menu.appendChild(item);
    });

    const toggle = wrap.querySelector("#langToggle");
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        wrap.classList.toggle("open");
    });
    document.addEventListener("click", () => wrap.classList.remove("open"));

    refreshLangSwitcherUI();
}

function refreshLangSwitcherUI() {
    const current = document.getElementById("langCurrent");

    if (current) {
        current.textContent = langMeta[currentLang].name;
    }

    const toggle = document.getElementById("langToggle");

    if (toggle) {
        toggle.setAttribute(
            "aria-label",
            t("changeLanguage")
        );

        toggle.setAttribute(
            "title",
            t("changeLanguage")
        );
    }

    document.querySelectorAll(".lang-option").forEach(el => {
        el.classList.toggle(
            "active",
            el.getAttribute("data-lang") === currentLang
        );
    });
}

function setLang(code) {
    if (!translations[code]) return;
    currentLang = code;
    localStorage.setItem("lang", code);
    applyStaticTranslations();
    refreshLangSwitcherUI();
    if (typeof onLanguageChanged === "function") onLanguageChanged();
}

document.addEventListener("DOMContentLoaded", () => {
    applyStaticTranslations();
    buildLanguageSwitcher();
});
