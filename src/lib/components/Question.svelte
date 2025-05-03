<!-- Question.svelte (updated for mobile) -->
<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    
    export let question: string;
    export let userAnswer: string;
    export let isIncorrect = false;
    export let isCorrect = false;
    
    let inputElement: HTMLInputElement;
    
    // Fix the deprecated signature by adding explicit type
    const dispatch = createEventDispatcher<{
      submit: void;
    }>();
    
    onMount(() => {
      if (inputElement) {
        inputElement.focus();
      }
    });
    
    function handleSubmit(e?: Event) {
      // Prevent default behavior for both button clicks and enter key
      if (e) e.preventDefault();
      
      if (userAnswer.trim() === '') return; // Don't submit if empty
      dispatch('submit');
    }
    
    function handleKeydown(event: KeyboardEvent) {
      // Allow system shortcuts (Cmd/Ctrl + key)
      if (event.metaKey || event.ctrlKey) {
        return true; // Let the event pass through
      }
      
      // Allow only numbers, minus sign, backspace, delete, and arrow keys
      const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
      
      if (!allowedKeys.includes(event.key)) {
        event.preventDefault();
        return false;
      }
      
      // Only allow minus at the beginning
      if (event.key === '-' && userAnswer !== '') {
        event.preventDefault();
        return false;
      }
      
      if (event.key === 'Enter') {
        if (userAnswer.trim() === '') return; // Don't submit if empty
        event.preventDefault(); // Prevent form submission
        handleSubmit(event); // Pass the event to handleSubmit
      }
    }
    
    function handleInput(event: Event) {
      const input = event.target as HTMLInputElement;
      const cursorPosition = input.selectionStart || 0;
      
      // Replace any non-numeric characters (except minus sign)
      const newValue = input.value.replace(/[^0-9-]/g, '');
      
      // Ensure minus sign is only at the beginning
      let formattedValue = newValue;
      if (newValue.includes('-')) {
        // Remove all minus signs
        formattedValue = newValue.replace(/-/g, '');
        
        // Add a single minus sign at the beginning if needed
        if (newValue.startsWith('-')) {
          formattedValue = '-' + formattedValue;
        }
      }
      
      // Only update if the value changed to avoid cursor jumping
      if (input.value !== formattedValue) {
        input.value = formattedValue;
        userAnswer = formattedValue;
        
        // Adjust cursor position if the formatted value is shorter
        const newPosition = Math.min(cursorPosition, formattedValue.length);
        input.setSelectionRange(newPosition, newPosition);
      }
    }
    
    $: isEmpty = userAnswer.trim() === '';
  </script>
  
  <div class="bg-white p-3 rounded-lg shadow-md mb-3">
    <div class="text-xl font-bold text-center mb-3">{question}</div>
    
    <form on:submit={handleSubmit} class="flex">
      <input
        bind:this={inputElement}
        type="text"
        inputmode="numeric"
        bind:value={userAnswer}
        on:keydown={handleKeydown}
        on:input={handleInput}
        class="w-full p-2 text-lg text-center border-2 rounded-md"
        class:border-red-500={isIncorrect}
        class:border-green-500={isCorrect}
        class:shake={isIncorrect}
        class:success-pulse={isCorrect}
        class:border-gray-300={!isIncorrect && !isCorrect}
        placeholder="Your answer"
      />
      
      <button 
        type="submit"
        class="ml-2 px-4 py-2 rounded-md {isEmpty ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}"
        disabled={isEmpty}
      >
        Submit
      </button>
    </form>
  </div>
  
  <style>
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .success-pulse {
      animation: success-pulse 1s ease-in-out;
    }
    
    @keyframes success-pulse {
      0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
      100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }
  </style>