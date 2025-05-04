<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
	
	onMount(() => {
		if (!browser) return;
		
		// Prevent all zoom gestures
		const preventZoom = (e: TouchEvent) => {
			if (e.touches.length > 1) {
				e.preventDefault();
			}
		};
		
		// Prevent double-tap zoom
		const preventDoubleTapZoom = (() => {
			let lastTap = 0;
			return (e: TouchEvent) => {
				const now = Date.now();
				const DOUBLE_TAP_THRESHOLD = 300;
				if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
					e.preventDefault();
				}
				lastTap = now;
			};
		})();
		
		// Add event listeners with passive: false to allow preventDefault
		document.addEventListener('touchstart', preventZoom, { passive: false });
		document.addEventListener('touchmove', preventZoom, { passive: false });
		document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
		
		// Add styles directly to the document instead of using a global style
		if (document.head) {
			const style = document.createElement('style');
			style.innerHTML = `
				body {
					-webkit-touch-callout: none;
					-webkit-user-select: none;
					-khtml-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
					touch-action: manipulation;
				}
			`;
			document.head.appendChild(style);
		}
		
		return () => {
			// Clean up event listeners when component unmounts
			document.removeEventListener('touchstart', preventZoom);
			document.removeEventListener('touchmove', preventZoom);
			document.removeEventListener('touchend', preventDoubleTapZoom);
		};
	});
</script>

{@render children()}