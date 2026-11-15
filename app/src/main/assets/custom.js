window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});(function () {
    const ACCOUNT_KEY = "gsupl_stu_account";
    const PWD_KEY = "gsupl_stu_pwd";
    const AVATAR = "data:image/jpeg;base64,【把文件里那一长串base64粘在这里】";

    let account = localStorage.getItem(ACCOUNT_KEY);
    let pwd = localStorage.getItem(PWD_KEY);

    // 本机已有账号 → 直接进入自动登录监听，不再弹窗
    if (account && pwd) { startAutoLogin(); return; }

    // ---------- 样式 ----------
    function injectStyle() {
        if (document.getElementById("gsupl-modal-style")) return;
        const style = document.createElement("style");
        style.id = "gsupl-modal-style";
        style.textContent = `
            @keyframes gsuplPop { 0%{transform:scale(.92);opacity:0} 100%{transform:scale(1);opacity:1} }
            #gsupl-acc::placeholder, #gsupl-pwd::placeholder { color:#C2AB8D; }
            #gsupl-acc:focus, #gsupl-pwd:focus { border-color:#FFC93C; box-shadow:0 0 0 4px rgba(255,201,60,.28); background:#FFFDF6; }
            #gsupl-btn:active { transform:scale(.97); }
        `;
        document.head.appendChild(style);
    }

    // ---------- 弹窗 ----------
    function showLoginModal() {
        if (document.getElementById("gsupl-modal")) return;
        injectStyle();

        const html = `
        <div id="gsupl-modal" style="
            position:fixed; inset:0; z-index:999999;
            background:linear-gradient(160deg,#FFF7E3 0%,#FFF1D2 55%,#FFE9C2 100%);
            display:flex; align-items:center; justify-content:center;
            padding:26px; box-sizing:border-box;
            font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;
            -webkit-tap-highlight-color:transparent;
            animation:gsuplPop .28s ease-out;
        ">
            <div style="position:absolute; top:90px; left:46px; font-size:26px; opacity:.16;">🐾</div>
            <div style="position:absolute; bottom:120px; right:52px; font-size:30px; opacity:.16;">🐾</div>
            <div style="position:absolute; top:236px; right:34px; font-size:20px; opacity:.12;">🐾</div>

            <div style="
                width:100%; max-width:350px;
                background:#FFFFFF;
                border:2px solid #F6DEB8;
                border-radius:26px;
                padding:26px 22px 22px;
                box-sizing:border-box;
                box-shadow:0 18px 44px rgba(160,110,60,.18);
                text-align:center;
            ">
                <div style="display:flex; justify-content:center;">
                    <img src="${AVATAR}" style="
                        width:96px; height:96px; border-radius:18px;
                        border:3px solid #FFFFFF;
                        box-shadow:0 10px 24px rgba(160,110,60,.28);
                        object-fit:cover; display:block;
                    ">
                </div>

                <div style="font-size:20px; font-weight:800; color:#6B4423; letter-spacing:.5px; margin-top:10px;">
                    甘肃政法大学
                </div>
                <div style="font-size:13px; color:#B58A5C; margin-top:6px; margin-bottom:20px;">
                    学工系统 · 账号登录
                </div>

                <div style="margin-bottom:12px;">
                    <input id="gsupl-acc" type="text" inputmode="text" placeholder="学号 / 教工号" style="
                        width:100%; height:50px;
                        border:1.6px solid #F2E0C2; border-radius:999px;
                        background:#FFFBF0; padding:0 20px;
                        font-size:15px; color:#5A3B22;
                        box-sizing:border-box; outline:none; transition:all .18s;
                    ">
                </div>

                <div style="margin-bottom:20px;">
                    <input id="gsupl-pwd" type="password" placeholder="登录密码" style="
                        width:100%; height:50px;
                        border:1.6px solid #F2E0C2; border-radius:999px;
                        background:#FFFBF0; padding:0 20px;
                        font-size:15px; color:#5A3B22;
                        box-sizing:border-box; outline:none; transition:all .18s;
                    ">
                </div>

                <button id="gsupl-btn" style="
                    width:100%; height:52px;
                    border:none; border-radius:999px;
                    background:linear-gradient(135deg,#FFDC5E 0%,#FFBE30 100%);
                    color:#6B4423; font-size:16px; font-weight:800; letter-spacing:1.5px;
                    box-shadow:0 9px 20px rgba(255,190,48,.42);
                    transition:transform .12s;
                ">
                    保存并登录
                </button>

                <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-top:16px;">
                    <span style="font-size:12px; color:#B99B77;">仅保存在本机</span>
                    <span style="width:1px; height:11px; background:#EBD9BE;"></span>
                    <span id="gsupl-reset" style="font-size:12px; color:#E09A4E; text-decoration:underline;">换账号</span>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML("beforeend", html);

        const accEl = document.getElementById("gsupl-acc");
        const pwdEl = document.getElementById("gsupl-pwd");
        const btnEl = document.getElementById("gsupl-btn");
        const resetEl = document.getElementById("gsupl-reset");

        btnEl.onclick = function () {
            const valAcc = accEl.value.trim();
            const valPwd = pwdEl.value.trim();
            if (!valAcc || !valPwd) { showToast("学号和密码都要填哦"); return; }
            localStorage.setItem(ACCOUNT_KEY, valAcc);
            localStorage.setItem(PWD_KEY, valPwd);
            account = valAcc; pwd = valPwd;
            document.getElementById("gsupl-modal").remove();
            startAutoLogin();
        };

        resetEl.onclick = function () {
            localStorage.removeItem(ACCOUNT_KEY);
            localStorage.removeItem(PWD_KEY);
            showToast("已清除，重新填写");
            location.reload();
        };
    }

    // ---------- 掉线自动重登 ----------
    function startAutoLogin() {
        let submitting = false;

        function fillAndSubmit() {
            if (submitting) return;
            const userInput = document.querySelector('input[name="username"],input[name="account"],input[id*="user"],input[placeholder*="学号"],input[placeholder*="教工"]');
            const passInput = document.querySelector('input[name="password"],input[type="password"],input[id*="pwd"],input[placeholder*="密码"]');
            if (!userInput || !passInput) return;

            if (!userInput.value) {
                userInput.value = account;
                userInput.dispatchEvent(new Event("input", { bubbles: true }));
                userInput.dispatchEvent(new Event("change", { bubbles: true }));
            }
            if (!passInput.value) {
                passInput.value = pwd;
                passInput.dispatchEvent(new Event("input", { bubbles: true }));
                passInput.dispatchEvent(new Event("change", { bubbles: true }));
            }

            const submitBtn = document.querySelector('button[type="submit"],input[type="submit"],.login-btn,.btn-login');
            // 想改成手动点登录，把下面 4 行删掉
            if (submitBtn) {
                submitting = true;
                submitBtn.click();
                setTimeout(function () { submitting = false; }, 3000);
            }
        }

        fillAndSubmit();
        setInterval(fillAndSubmit, 1500);
    }

    // ---------- 提示条 ----------
    function showToast(msg) {
        const t = document.createElement("div");
        t.innerText = msg;
        t.style.cssText = `
            position:fixed; top:38px; left:50%; transform:translateX(-50%);
            background:#6B4423; color:#FFE9BE;
            padding:10px 20px; border-radius:999px;
            font-size:13px; z-index:10000000;
            box-shadow:0 8px 22px rgba(107,68,35,.35);
        `;
        document.body.appendChild(t);
        setTimeout(function () { t.remove(); }, 1800);
    }

    if (document.readyState === "complete") { showLoginModal(); }
    else { window.addEventListener("load", showLoginModal); }
})();


// ========== 定位劫持（甘肃政法大学兰州新区校区） ==========
const BASE_LAT = 36.535810;
const BASE_LNG = 103.738600;
const ALT = 1900;
const JITTER_METER = 0;

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function jitterCoordinate(lat, lng, meter) {
    const latDelta = meter / 111000;
    const lngDelta = meter / (111000 * Math.cos(lat * Math.PI / 180));
    return {
        lat: lat + randomRange(-latDelta, latDelta),
        lng: lng + randomRange(-lngDelta, lngDelta)
    };
}

function createPosition() {
    const pos = jitterCoordinate(BASE_LAT, BASE_LNG, JITTER_METER);
    const accuracy = randomRange(8, 20);
    return {
        coords: {
            latitude: pos.lat,
            longitude: pos.lng,
            accuracy: accuracy,
            altitude: ALT,
            altitudeAccuracy: 8,
            heading: null,
            speed: null
        },
        timestamp: Date.now()
    };
}

const geoObj = {
    getCurrentPosition: function (success, error, options) {
        setTimeout(function () { success(createPosition()); }, 120);
    },
    watchPosition: function (success) {
        success(createPosition());
        return 1;
    },
    clearWatch: function () {}
};

window.addEventListener('load', function () {
    Object.defineProperty(navigator, "geolocation", {
        value: geoObj,
        writable: false,
        configurable: false,
        enumerable: true
    });
});
