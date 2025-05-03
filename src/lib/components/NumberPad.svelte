<!-- NumberPad.svelte (updated for mobile) -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let userAnswer: string = '';
  
  const dispatch = createEventDispatcher();
  
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '-', '0', 'delete'
  ];
  
  function handleClick(value: string) {
    if (value === 'delete') {
      dispatch('input', 'delete');
    } else if (value === '-') {
      // Only allow minus sign at the beginning
      if (userAnswer === '') {
        dispatch('input', '-');
      }
    } else {
      dispatch('input', value);
    }
  }
</script>

<div class="bg-white p-2 rounded-lg shadow-md grid grid-cols-3 gap-1 mt-3">
  {#each buttons as button}
    <button 
      on:click={() => handleClick(button)}
      class="p-2 text-lg rounded-md {button === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-200'} {button === '-' && userAnswer !== '' ? 'opacity-50' : ''}"
      disabled={button === '-' && userAnswer !== ''}
    >
      {#if button === 'delete'}
        ←
      {:else}
        {button}
      {/if}
    </button>
  {/each}
  
  <button 
    on:click={() => dispatch('input', 'submit')}
    class="col-span-3 p-2 text-lg bg-blue-500 text-white rounded-md mt-1"
  >
    Submit
  </button>
</div>