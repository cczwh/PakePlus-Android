window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ========== 自动登录填充模块 ==========
(function () {
    // 在这里填写你的学工账号、密码
    const USER_ACCOUNT = "请输入教工号/学号";
    const USER_PWD = "请输入登录密码";

    function fillLogin() {
        // 寻找账号输入框
        let accountInput = document.querySelector('input[name="username"],input[name="account"],input[id*="user"],input[id*="account"]');
        let pwdInput = document.querySelector('input[name="password"],input[name="pwd"],input[id*="pwd"],input[id*="password"]');
        let loginBtn = document.querySelector('button[type="submit"],input[type="submit"],button:contains("登录"),a:contains("登录")');

        if (accountInput && !accountInput.value) {
            accountInput.value = USER_ACCOUNT;
            // 触发页面识别输入事件
            accountInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (pwdInput && !pwdInput.value) {
            pwdInput.value = USER_PWD;
            pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        // 如果找到登录按钮，自动点击（不想自动点就注释掉下面这行）
        if (accountInput && pwdInput && loginBtn) {
            loginBtn.click();
        }
    }

    // 轮询等待登录框加载出来（页面加载慢，延迟检测）
    const timer = setInterval(() => {
        fillLogin();
        // 检测如果已经不是登录页，停止轮询
        if (!document.querySelector('input[name="username"],input[name="password"]')) {
            clearInterval(timer);
        }
    }, 800);
    // 最多等待10秒，防止无限循环
    setTimeout(() => clearInterval(timer), 10000);
})();


// ========== 定位劫持脚本 ==========
const BASE_LAT = 36.535810;
const BASE_LNG = 103.738600;
const JITTER_METER = 5;

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


