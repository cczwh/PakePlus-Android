window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

const rawOpen = window.open
window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// ---------------- 固定定位劫持：甘肃政法大学兰州新区校区北门 WGS84 增强模拟版 ----------------
const FIX_LAT = 36.535944;
const FIX_LNG = 103.736890;

// 随机工具
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// 模拟真实GPS数据
function makeGeoPosition() {
    const acc = randomRange(6, 28); // 精度随机 6~28米
    let heading = Math.random() > 0.2 ? randomRange(0, 360) : null;
    let speed = heading !== null ? randomRange(0, 1.8) : null;
    return {
        coords: {
            latitude: FIX_LAT,
            longitude: FIX_LNG,
            accuracy: acc,
            altitude: null,
            altitudeAccuracy: null,
            heading: heading,
            speed: speed
        },
        timestamp: Date.now()
    }
}

Object.defineProperty(navigator, 'geolocation', {
    value: {
        getCurrentPosition: function (success, error, options) {
            options = options || {};
            const timeout = options.timeout || Infinity;
            // 小概率模拟定位超时失败（15%概率）
            if (Math.random() < 0.15 && timeout > 0) {
                setTimeout(() => {
                    if (error) {
                        error({
                            code: 3,
                            message: "Position retrieval timed out."
                        })
                    }
                }, randomRange(timeout * 0.3, timeout));
                return;
            }
            // 正常返回位置
            setTimeout(() => {
                success(makeGeoPosition());
            }, randomRange(40, 220)); // 模拟GPS延迟，不是立刻返回
        },
        watchPosition: function (success, error, options) {
            options = options || {};
            const timer = setInterval(() => {
                success(makeGeoPosition());
            }, randomRange(1200, 3500));
            return timer;
        },
        clearWatch: function (id) {
            clearInterval(id);
        }
    },
    writable: false,
    configurable: false
})
