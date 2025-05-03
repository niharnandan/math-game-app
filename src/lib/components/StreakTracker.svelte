<!-- StreakTracker.svelte (updated for mobile) -->
<script lang="ts">
	export let currentStreak: number;
	export let longestStreak: number;
  </script>
  
  <div class="bg-white p-2 rounded-lg shadow-md mb-3 flex justify-between">
	<div>
	  <h2 class="text-xs font-medium text-gray-600">Current Streak</h2>
	  <p class="text-xl font-bold">{currentStreak}</p>
	</div>
	
	<div>
	  <h2 class="text-xs font-medium text-gray-600">Longest Streak</h2>
	  <p class="text-xl font-bold">{longestStreak}</p>
	</div>
  </div>