<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let userAnswer: string = '';
  export let isEmpty: boolean = true;
  
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

<div class="bg-white p-2 rounded-lg shadow-md grid grid-cols-3 gap-1 mb-2 pb-6">
  {#each buttons as button}
    <button 
      on:click={() => handleClick(button)}
      class="p-3 text-xl rounded-md {button === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-200'} {button === '-' && userAnswer !== '' ? 'opacity-50' : ''}"
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
    class="col-span-3 p-3 text-xl rounded-md mt-1 {isEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}"
    disabled={isEmpty}
  >
    Submit
  </button>
</div>