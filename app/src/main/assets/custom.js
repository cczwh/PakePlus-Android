window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
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

// ---------------- 精简高配仿真：甘肃政法大学兰州新区校区北门 WGS84 ----------------
const BASE_LAT = 36.535944;
const BASE_LNG = 103.736890;
const ALT = 1920;

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
function jitterCoord(lat, lng, meter = 0.7) {
    const latDelta = meter / 111000;
    const lngDelta = meter / (111000 * Math.cos(lat * Math.PI / 180));
    return {
        lat: lat + randomRange(-latDelta, latDelta),
        lng: lng + randomRange(-lngDelta, lngDelta)
    }
}
function makeGeoPosition(isWatch = false) {
    const pos = jitterCoord(BASE_LAT, BASE_LNG, isWatch ? 1.5 : 0.7);
    const acc = randomRange(6, 28);
    const hasAlt = Math.random() > 0.35;
    let heading = Math.random() > 0.2 ? randomRange(0, 360) : null;
    let speed = heading !== null ? randomRange(0, 1.8) : null;
    return {
        coords: {
            latitude: pos.lat,
            longitude: pos.lng,
            accuracy: acc,
            altitude: hasAlt ? ALT + randomRange(-6, 6) : null,
            altitudeAccuracy: hasAlt ? randomRange(8, 25) : null,
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
            const timeout = options.timeout ?? Infinity;
            if (Math.random() < 0.12) {
                setTimeout(() => error?.({code:3,message:"Position retrieval timed out."}), randomRange(timeout * 0.25, timeout));
                return;
            }
            setTimeout(() => success(makeGeoPosition(false)), randomRange(40, 220));
        },
        watchPosition: function (success) {
            const timer = setInterval(() => success(makeGeoPosition(true)), randomRange(1200, 3500));
            return timer;
        },
        clearWatch: function (id) { clearInterval(id); }
    },
    writable: false,
    configurable: false
})
