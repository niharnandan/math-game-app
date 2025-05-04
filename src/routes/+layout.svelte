<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();
	
	onMount(() => {
		// Prevent double-tap zoom on mobile
		let lastTouchEnd = 0;
		document.addEventListener('touchend', function(event) {
			const now = Date.now();
			if (now - lastTouchEnd <= 1000) {
				event.preventDefault();
			}
			lastTouchEnd = now;
		}, false);
	});
</script>

{@render children()}