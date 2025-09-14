/*
Aniota Learning Mentor Mode: Process Flow

1. Activation
	- Intervention: Aniota detects a situation and intervenes, presenting an observation and an offer to help.
	- User Activation: User clicks the Aniota Activation Button on the Desktop.

2. Initial Interaction
	- If Intervention:
		 - Aniota displays a message combining the observation with an offer to help.
		 - If the user accepts, Aniota presents a list of topics or strategems for solving the detected problem.
	- If User Activation:
		 - Aniota presents topics based on the most recent user data.
		 - Aniota provides a text input area for the user to describe the help they require.

3. Path Selection & Learning Path
	- The user chooses a topic, strategem, or describes their need.
	- Aniota starts a new Learning Path or continues an existing one based on the user's choice.

This flow ensures Aniota can both proactively assist (intervention) and respond to direct user requests, always guiding the user into a structured learning or problem-solving path.
*/
// Aniota Presence State Manager & Mentor Integration
// States: HOUSEKEEPING, TRANSITIONING, ACTIVE, RESEARCH, QUESTIONING, INTERVENTION

const ANIOTA_STATES = Object.freeze({
	HOUSEKEEPING: 'housekeeping',
	TRANSITIONING: 'transitioning',
	ACTIVE: 'active',
	RESEARCH: 'research',
	QUESTIONING: 'questioning',
	INTERVENTION: 'intervention'
});

class AniotaPresence {
	// --- SVG Profile Animation Logic (archived from aniota_profile.js) ---
	startProfileAnimation() {
		// Expects an SVG path element with id 'aniota-body-profile' in the DOM
		const aniota = document.getElementById("aniota-body-profile");
		if (!aniota) return;
		const centerX = 200;
		const centerY = 200;
		const width = 180;
		const height = 180;
		const topY = centerY - height / 2;
		const bottomY = centerY + height / 2;
		const points = 40;
		let t = 0;

		function getProfilePath(time) {
			const pearOffset = 32;
			const waistOffset = 28;
			const waistY = centerY + height * 0.18;
			let path = "";
			const topEdge = [];
			const bottomEdge = [];
			for (let i = 0; i <= points; i++) {
				const x = centerX - width / 2 + (width * i) / points;
				const phase = (i / points) * Math.PI * 5;
				const y = topY - Math.sin(phase) * 12 + (i === 0 || i === points ? 8 : 0);
				topEdge.push({ x, y });
			}
			let crestY = Infinity;
			for (let i = points; i >= 0; i--) {
				const x = centerX - width / 2 + (width * i) / points;
				const phase = (i / points) * Math.PI * 4 + time * 0.7;
				const y = bottomY + Math.sin(phase) * 10 * (i === 0 || i === points ? 0.5 : 1);
				bottomEdge.push({ x, y });
				if (y < crestY) crestY = y;
			}
			const ankleY = waistY + (crestY - waistY) * 0.5;
			const absY = waistY + (ankleY - waistY) * 0.5;
			const leftCrest = { x: centerX - width / 2 - pearOffset, y: crestY };
			const rightCrest = { x: centerX + width / 2 + pearOffset, y: crestY };
			const leftWaist = { x: centerX - width / 2 + waistOffset, y: waistY };
			const rightWaist = { x: centerX + width / 2 - waistOffset, y: waistY };
			path = `M ${topEdge[0].x} ${topEdge[0].y}`;
			for (let i = 1; i < topEdge.length; i++) {
				const prev = topEdge[i - 1];
				const curr = topEdge[i];
				const c1x = prev.x + (curr.x - prev.x) / 3;
				const c1y = prev.y + (curr.y - prev.y) / 3;
				const c2x = prev.x + (2 * (curr.x - prev.x)) / 3;
				const c2y = prev.y + (2 * (curr.y - prev.y)) / 3;
				path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
			}
			path += ` C ${topEdge[points].x + 20} ${topEdge[points].y}, ${rightWaist.x - 20} ${rightWaist.y}, ${rightWaist.x} ${rightWaist.y}`;
			path += ` C ${rightCrest.x - 20} ${rightCrest.y}, ${rightWaist.x + 20} ${rightWaist.y}, ${rightCrest.x} ${rightCrest.y}`;
			for (let i = 1; i < bottomEdge.length - 1; i++) {
				const prev = bottomEdge[i - 1];
				const curr = bottomEdge[i];
				const c1x = prev.x + (curr.x - prev.x) / 3;
				const c1y = prev.y + (curr.y - prev.y) / 3;
				const c2x = prev.x + (2 * (curr.x - prev.x)) / 3;
				const c2y = prev.y + (2 * (curr.y - prev.y)) / 3;
				path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
			}
			path += ` C ${leftCrest.x - 20} ${leftCrest.y}, ${leftWaist.x + 20} ${leftWaist.y}, ${leftWaist.x} ${waistY}`;
			path += ` C ${leftWaist.x + 20} ${leftWaist.y}, ${topEdge[0].x - 20} ${topEdge[0].y}, ${topEdge[0].x} ${topEdge[0].y}`;
			path += " Z";
			return path;
		}

		function animate() {
			t += 0.04;
			aniota.setAttribute("d", getProfilePath(t));
			requestAnimationFrame(animate);
		}

		animate();
	}
	// --- Skirt Animation Logic (for skirt form) ---
	startSkirtAnimation() {
		// Expects an SVG path element with id 'aniota-skirt' in the DOM
		const skirt = document.getElementById("aniota-skirt");
		if (!skirt) return;
		const bodyCenterX = 200;
		const bodyBottomY = 250;
		const skirtWidth = 180;
		const skirtHeight = 40;
		const points = 40;
		const amplitude = 18;
		const frequency = 2.2;
		let t = 0;

		function getSkirtPath(time) {
			let path = `M ${bodyCenterX - skirtWidth / 2} ${bodyBottomY}`;
			for (let i = 0; i <= points; i++) {
				const x = bodyCenterX - skirtWidth / 2 + (skirtWidth * i) / points;
				const phase = (i / points) * Math.PI * frequency + time;
				const y = bodyBottomY + skirtHeight + Math.sin(phase) * amplitude;
				path += ` L ${x} ${y}`;
			}
			path += ` L ${bodyCenterX + skirtWidth / 2} ${bodyBottomY}`;
			path += " Z";
			return path;
		}

		function animate() {
			t += 0.04;
			skirt.setAttribute("d", getSkirtPath(t));
			requestAnimationFrame(animate);
		}

		animate();
	}
	// --- Animated Orb Logic (from legacy presence) ---
	startAnimation() {
		// Legacy animation logic for the presence orb
		const circle = document.getElementById("aniota-placeholder");
		if (!circle) return;
		let t = 0;
		const centerY = window.innerHeight / 2;
		const radius = 120;
		const gravity = 0.2;
		const driftSpeed = 0.7; // rightward drift
		const disappearX = window.innerWidth + 200; // disappear threshold

		function twoStepMotion(time) {
			// Two steps forward, one step back using a modulated sawtooth
			const cycle = time % 3;
			if (cycle < 2) {
				return time * 2; // forward
			} else {
				return time * -1; // back
			}
		}

		function animate() {
			t += 0.02;
			// Sine wave for vertical motion
			const y = centerY + Math.sin(t) * radius * 0.7 - gravity * Math.pow(t, 2);
			// Two-step forward, one-step back for horizontal
			let x = 100 + twoStepMotion(t) + driftSpeed * t * 60;
			circle.style.position = "absolute";
			circle.style.left = `${x}px`;
			circle.style.top = `${y - 100}px`;
			// If off screen, hide
			if (x > disappearX) {
				circle.style.display = "none";
			} else {
				circle.style.display = "block";
			}
			requestAnimationFrame(animate);
		}

		animate();
	}
	constructor() {
		this.state = ANIOTA_STATES.HOUSEKEEPING;
		this.mentor = null; // Placeholder for mentor logic
		this.init();
	}

	init() {
		// Initialize presence UI, event listeners, etc.
		this.setState(ANIOTA_STATES.HOUSEKEEPING);
	}

	setState(newState) {
		if (!Object.values(ANIOTA_STATES).includes(newState)) {
			console.warn('Unknown state:', newState);
			return;
		}
		this.state = newState;
		console.log(`AniotaPresence: State changed to ${newState}`);
		this.handleStateEntry(newState);
	}

	handleStateEntry(state) {
		switch (state) {
			case ANIOTA_STATES.HOUSEKEEPING:
				this.enterHousekeeping(); break;
			case ANIOTA_STATES.TRANSITIONING:
				this.enterTransitioning(); break;
			case ANIOTA_STATES.ACTIVE:
				this.enterActive(); break;
			case ANIOTA_STATES.RESEARCH:
				this.enterResearch(); break;
			case ANIOTA_STATES.QUESTIONING:
				this.enterQuestioning(); break;
			case ANIOTA_STATES.INTERVENTION:
				this.enterIntervention(); break;
		}
	}

	// --- State Handlers (to be filled in with mentor logic) ---
	enterHousekeeping() { /* TODO: Add housekeeping logic */ }
	enterTransitioning() { /* TODO: Add transitioning logic */ }
	enterActive() { /* TODO: Add active mentor logic */ }
	enterResearch() { /* TODO: Add research logic */ }
	enterQuestioning() { /* TODO: Add questioning logic */ }
	enterIntervention() { /* TODO: Add intervention logic */ }
}

// Initialize AniotaPresence on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
	window.aniotaPresence = new AniotaPresence();
});
