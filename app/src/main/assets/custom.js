window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ========== 每人首次录入自己账号，本地保存，掉线自动登录 ==========
(function () {
    const ACCOUNT_KEY = "stu_account";
    const PWD_KEY = "stu_pwd";
    // 读取本机保存的账号密码
    let account = localStorage.getItem(ACCOUNT_KEY);
    let pwd = localStorage.getItem(PWD_KEY);

    // 本机还没存账号密码 → 弹窗让使用者录入自己的
    if (!account || !pwd) {
        const inputAccount = prompt("请输入你的学号：");
        if (inputAccount === null) return;
        const inputPwd = prompt("请输入你的学工密码：");
        if (inputPwd === null) return;
        account = inputAccount;
        pwd = inputPwd;
        // 保存在当前这台手机本地
        localStorage.setItem(ACCOUNT_KEY, account);
        localStorage.setItem(PWD_KEY, pwd);
    }

    // 自动填充+自动提交登录
    function autoLogin() {
        const userInput = document.querySelector('input[name="username"],input[name="account"],input[id*="user"]');
        const passInput = document.querySelector('input[name="password"],input[name="pwd"],input[id*="pwd"]');
        const submitBtn = document.querySelector('button[type="submit"],input[type="submit"]');

        if (userInput && passInput) {
            if (!userInput.value) {
                userInput.value = account;
                userInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (!passInput.value) {
                passInput.value = pwd;
                passInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }

    // 持续轮询检测登录页面
    const timer = setInterval(() => {
        autoLogin();
        // 离开登录页，停止轮询
        if (!document.querySelector('input[name="username"],input[name="password"]')) {
            clearInterval(timer);
        }
    }, 700);
    // 最多等待12秒，防止死循环
    setTimeout(() => clearInterval(timer), 12000);
})();

// ========== 定位劫持脚本 ==========
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
    }
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
    }
}

const geoObj = {
    getCurrentPosition: function (success, error, options) {
        setTimeout(() => {
            success(createPosition());
        }, 120);
    },
    watchPosition: function (success) {
        success(createPosition());
        return 1;
    },
    clearWatch: function () {}
};

window.addEventListener('load', function(){
    Object.defineProperty(navigator, "geolocation", {
        value: geoObj,
        writable: false,
        configurable: false,
        enumerable: true
    });
});
