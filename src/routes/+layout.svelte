<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
	
	onMount(() => {
		if (!browser) return;
		
		// Only prevent pinch zoom, which shouldn't interfere with normal tapping
		const preventPinchZoom = (e: TouchEvent) => {
			if (e.touches.length > 1) {
				e.preventDefault();
			}
		};
		
		// Add touch-action CSS to prevent all browser zooming behaviors
		if (document.head) {
			const style = document.createElement('style');
			style.innerHTML = `
				* {
					touch-action: pan-x pan-y;
				}
				.no-zoom {
					touch-action: manipulation;
				}
			`;
			document.head.appendChild(style);
			
			// Add the no-zoom class to the body
			document.body.classList.add('no-zoom');
		}
		
		// Only prevent multi-touch (pinch) gestures
		document.addEventListener('touchstart', preventPinchZoom, { passive: false });
		
		return () => {
			document.removeEventListener('touchstart', preventPinchZoom);
		};
	});
</script>

{@render children()}