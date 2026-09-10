// ---------- Dark Mode (automatic, follows system preference) ----------
(function () {
    const root = document.documentElement;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const THEME_COLORS = { light: "#202124", dark: "#16171a" };

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (themeMeta) themeMeta.setAttribute("content", THEME_COLORS[theme]);
    }

    if (window.matchMedia) {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        applyTheme(media.matches ? "dark" : "light");
        media.addEventListener("change", (e) => applyTheme(e.matches ? "dark" : "light"));
    }
})();
