
const backendWsUrl = (() => {
	// Use relative path for local dev, or ws://192.168.254.200:52330 for direct
	// alt is 41284
	if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
		return `ws://${window.location.hostname}:52330/ws/aniota_state`;
	}
	// For production, use same host as frontend
	return `ws://${window.location.host}/ws/aniota_state`;
})();

let aniotaWs = null;
let lastAniotaState = null;

function connectAniotaWebSocket() {
	aniotaWs = new WebSocket(backendWsUrl);
	aniotaWs.onopen = () => {
		console.log('[ANIOTA ORB] Connected to backend WebSocket');
	};
	aniotaWs.onmessage = (event) => {
		try {
			const state = JSON.parse(event.data);
			lastAniotaState = state;
			updateOrbFromBackendState(state);
		} catch (e) {
			console.warn('[ANIOTA ORB] Failed to parse backend state:', e);
		}
	};
	aniotaWs.onclose = () => {
		console.log('[ANIOTA ORB] WebSocket closed, retrying in 2s...');
		setTimeout(connectAniotaWebSocket, 2000);
	};
	aniotaWs.onerror = (e) => {
		console.warn('[ANIOTA ORB] WebSocket error:', e);
		aniotaWs.close();
	};
}

function updateOrbFromBackendState(state) {
	// Example: update orb color, mood, position, etc.
	const bubble = document.getElementById('aniota-bubble');
	if (!bubble) return;
	if (state.mood_color) {
		bubble.style.setProperty('--aniota-color', state.mood_color);
	}
	if (state.position && typeof state.position.x === 'number' && typeof state.position.y === 'number') {
		bubble.style.left = `${state.position.x}px`;
		bubble.style.top = `${state.position.y}px`;
		bubble.style.right = 'auto';
		bubble.style.transform = 'none';
	}
	// Optionally update other UI elements based on backend state
}

window.addEventListener('DOMContentLoaded', () => {
	connectAniotaWebSocket();
});

/*
aniotaWs = new WebSocket(backendWsUrl);
aniotaWs.onopen = () => {
	console.log('[ANIOTA ORB] Connected to backend WebSocket');
};
aniotaWs.onmessage = (event) => {
	try {
		const state = JSON.parse(event.data);
		lastAniotaState = state;
		updateOrbFromBackendState(state);
	} catch (e) {
		console.warn('[ANIOTA ORB] Failed to parse backend state:', e);
	}
};
aniotaWs.onclose = () => {
	console.log('[ANIOTA ORB] WebSocket closed, retrying in 2s...');
	setTimeout(connectAniotaWebSocket, 2000);
};
aniotaWs.onerror = (e) => {
	console.warn('[ANIOTA ORB] WebSocket error:', e);
	aniotaWs.close();
};
*/
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
