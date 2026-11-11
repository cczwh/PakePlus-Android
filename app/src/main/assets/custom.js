window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});const BASE_LAT = 36.53362594864504;
const BASE_LNG = 103.73791763329419;
const ALT = 1900;
const JITTER_METER = 18;

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

(function forceHookGeo() {
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
    Object.defineProperty(navigator, "geolocation", {
        value: geoObj,
        writable: false,
        configurable: false,
        enumerable: true
    });
    setInterval(() => {
        if (navigator.geolocation !== geoObj) {
            Object.defineProperty(navigator, "geolocation", {
                value: geoObj,
                writable: false,
                configurable: false,
                enumerable: true
            });
        }
    }, 800);
})();
