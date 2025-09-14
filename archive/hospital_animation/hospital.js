const windpower = document.getElementById('windpower');
const animationArea = document.getElementById('animation-area');
const helicopter1 = document.getElementById('helicopter1'); // helicopter.png
const helicopter2 = document.getElementById('helicopter2'); // helicopter_alt.png
const ambulance = document.getElementById('ambulance');

function getAreaWidth() {
    return animationArea.offsetWidth || window.innerWidth;
}

let windAngle = 1;
function rotateWindpower() {
    windAngle = (windAngle + 10) % 360;
    windpower.style.transform = `rotate(${windAngle}deg)`;
}
setInterval(rotateWindpower, 1000); // 12s for full rotation

function getHelicopterLandingX() {
    return parseInt(window.getComputedStyle(helicopter1).left, 10);
}
function getHelicopterLandingY() {
    return parseInt(window.getComputedStyle(helicopter1).top, 26);
}

let heliWaitLanding = 5000; // 5 seconds at landing
let heliWaitOffscreen = 10000; // 10 seconds offscreen
let heliSpeed = 0.2; // px/ms
let heliVerticalOffset = 100; // pixels above landing point for approach/takeoff
let propellerInterval = null;
let propellerToggleRate = 100; // ms

function setHelicopterPosition(x, y) {
    helicopter1.style.left = x + 'px';
    helicopter1.style.top = y + 'px';
    helicopter2.style.left = x + 'px';
    helicopter2.style.top = y + 'px';
}
function showHelicopter1() {
    helicopter1.style.display = 'block';
    helicopter2.style.display = 'none';
}
function showHelicopter2() {
    helicopter1.style.display = 'none';
    helicopter2.style.display = 'block';
}
function startPropellerAnimation() {
    let toggle = false;
    propellerInterval = setInterval(() => {
        if (toggle) {
            showHelicopter1();
        } else {
            showHelicopter2();
        }
        toggle = !toggle;
    }, propellerToggleRate);
}
function stopPropellerAnimation() {
    clearInterval(propellerInterval);
    propellerInterval = null;
    showHelicopter1(); // Always show helicopter.png when landed
}

function animateHelicopter() {
    const areaWidth = getAreaWidth();
    const heliWidth = helicopter1.offsetWidth;
    // Always read landingX and landingY from CSS at the start of each cycle
    const landingX = parseInt(window.getComputedStyle(helicopter1).left, 10);
    const landingY = parseInt(window.getComputedStyle(helicopter1).top, 10);
    const offscreenLeft = -heliWidth;
    const offscreenRight = areaWidth;
    const startY = landingY - heliVerticalOffset;
    // Start at right edge, higher Y
    setHelicopterPosition(offscreenRight, startY);
    helicopter1.style.visibility = 'visible';
    helicopter2.style.visibility = 'visible';
    startPropellerAnimation();

    // Fly in: right edge, high Y -> landing point
    let start = null;
    function flyIn(ts) {
        if (!start) start = ts;
        let progress = ts - start;
        let x = offscreenRight - (progress * heliSpeed);
        let y = startY + ((landingY - startY) * ((offscreenRight - x) / (offscreenRight - landingX)));
        if (x > landingX) {
            setHelicopterPosition(x, y);
            requestAnimationFrame(flyIn);
        } else {
            setHelicopterPosition(landingX, landingY);
            stopPropellerAnimation(); // Show helicopter.png when landed
            setTimeout(flyOut, heliWaitLanding);
        }
    }
    // Fly out: landing point -> left edge, high Y (smoothed ascent)
    function flyOut() {
        startPropellerAnimation();
        let start = null;
        const distance = landingX - offscreenLeft;
        const duration = distance / heliSpeed;
        function animateOut(ts) {
            if (!start) start = ts;
            let progress = ts - start;
            let x = landingX - (progress * heliSpeed);
            let y = landingY - ((landingY - startY) * (progress / duration));
            if (x > offscreenLeft) {
                setHelicopterPosition(x, y);
                requestAnimationFrame(animateOut);
            } else {
                setHelicopterPosition(offscreenLeft, startY);
                helicopter1.style.visibility = 'hidden';
                helicopter2.style.visibility = 'hidden';
                stopPropellerAnimation();
                setTimeout(animateHelicopter, heliWaitOffscreen);
            }
        }
        requestAnimationFrame(animateOut);
    }
    requestAnimationFrame(flyIn);
}
setTimeout(animateHelicopter, 1000); // initial delay

// Ambulance animation: accelerate right, wait, accelerate left, repeat

// Get start position from CSS for accuracy
let ambStartX = parseFloat(getComputedStyle(ambulance).left) || 0;
let ambWidth = ambulance.offsetWidth;
let ambAreaWidth = window.innerWidth;
let ambOffscreenRight = ambAreaWidth;
let ambOffscreenLeft = -ambWidth;
let ambWait = 3000; // 3 seconds wait offscreen
let ambAccel = 0.00005; // Much slower acceleration

// Utility function to get scaling factor
function getScalingFactor() {
    return window.devicePixelRatio || 1;
}

// Example usage: adjust ambulance position by scaling factor
function moveAmbulanceRight() {
    ambulance.style.visibility = 'visible';
    let ambStartX = parseFloat(getComputedStyle(ambulance).left) || 0;
    let ambStartY = parseFloat(getComputedStyle(ambulance).top) || 0;
    let scaling = getScalingFactor();
    let start = null;
    let velocity = 0;
    let bumpIntervalMs = 500;
    let bobFrequency = Math.PI / bumpIntervalMs;
    let bobAmplitude = 8 * scaling; // scale amplitude by devicePixelRatio
    function animateRight(ts) {
        if (!start) start = ts;
        let progress = ts - start;
        velocity = ambAccel * progress;
        let x = ambStartX + 0.5 * ambAccel * progress * progress;
        let sine = Math.sin(progress * bobFrequency);
        let bump = sine > 0 ? sine * bobAmplitude : 0;
        let y = ambStartY + bump;
        ambulance.style.top = y + 'px';
        if (x < ambOffscreenRight) {
            ambulance.style.left = x + 'px';
            requestAnimationFrame(animateRight);
        } else {
            ambulance.style.left = ambOffscreenRight + 'px';
            ambulance.style.visibility = 'hidden';
        }
    }
    requestAnimationFrame(animateRight);
}
setTimeout(moveAmbulanceRight, 1000); // initial delay

// Display viewport and pixel ratio info on screen
function showViewportInfo() {
    let infoDiv = document.getElementById('viewport-info');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.id = 'viewport-info';
        infoDiv.style.position = 'fixed';
        infoDiv.style.bottom = '10px';
        infoDiv.style.right = '10px';
        infoDiv.style.background = 'rgba(0,0,0,0.7)';
        infoDiv.style.color = '#fff';
        infoDiv.style.padding = '8px 16px';
        infoDiv.style.borderRadius = '8px';
        infoDiv.style.zIndex = '9999';
        document.body.appendChild(infoDiv);
    }
    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = window.devicePixelRatio;
    infoDiv.textContent = `Viewport: ${w} x ${h} | Pixel Ratio: ${dpr}`;
}
window.addEventListener('resize', showViewportInfo);
window.addEventListener('DOMContentLoaded', showViewportInfo);
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
