<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Question from '$lib/components/Question.svelte';
	import NumberPad from '$lib/components/NumberPad.svelte';
	import StreakTracker from '$lib/components/StreakTracker.svelte';
	import { browser } from '$app/environment';
	
	let questions: Array<{ question: string; answer: number }> = [];
	let currentQuestionIndex = 0;
	let currentStreak = 0;
	let longestStreak = 0;
	let userAnswer = '';
	let isIncorrect = false;
	let isCorrect = false;
	let isMobile = false;
	let isLoadingMoreQuestions = false;
	
	// Calculate if input is empty
	$: isEmpty = userAnswer.trim() === '';
	
	// Check if we're on mobile
	onMount(() => {
	  if (browser) {
		// Check for mobile device
		isMobile = window.innerWidth <= 768;
		window.addEventListener('resize', handleResize);
		
		// Get streak from session storage if it exists
		const storedLongestStreak = sessionStorage.getItem('longestStreak');
		
		// Only load longest streak - current streak should reset on refresh
		if (storedLongestStreak) {
		  longestStreak = parseInt(storedLongestStreak);
		}
		
		// Reset current streak on page load/refresh
		currentStreak = 0;
		sessionStorage.setItem('currentStreak', '0');
		
		// Load initial questions
		loadQuestions();
	  }
	});
	
	onDestroy(() => {
	  if (browser) {
		window.removeEventListener('resize', handleResize);
	  }
	});
	
	function handleResize() {
	  isMobile = window.innerWidth <= 768;
	}
	
	async function loadQuestions() {
    if (isLoadingMoreQuestions) return; // Prevent multiple simultaneous requests
    
    isLoadingMoreQuestions = true;
    
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      
      // Filter out any duplicate questions
      const newQuestions = data.questions.filter((newQuestion: { question: string; }) => 
        !questions.some(existingQuestion => 
          existingQuestion.question === newQuestion.question
        )
      );
      
      // Add the new questions
      questions = [...questions, ...newQuestions];
      
      console.log(`Loaded ${newQuestions.length} new questions. Total: ${questions.length}`);
      
    } catch (error) {
      console.error('Error loading questions:', error);
      
      // Only use fallback if we have no questions yet
      if (questions.length === 0) {
        questions = [
          { question: "12 + 8 × 3", answer: 36 },
          { question: "45 - 5 × 7", answer: 10 },
          { question: "24 ÷ 6 + 9", answer: 13 },
          { question: "7 × 4 - 10", answer: 18 },
          { question: "30 ÷ 5 + 12", answer: 18 },
          { question: "9 × 6 - 15", answer: 39 },
          { question: "48 ÷ 8 + 5", answer: 11 },
          { question: "17 + 4 × 6", answer: 41 },
          { question: "50 - 40 ÷ 8", answer: 45 },
          { question: "3 × 9 + 22", answer: 49 }
        ];
      }
    } finally {
      isLoadingMoreQuestions = false;
    }
  }
  
  // Check if we need to load more questions
  $: {
    // Load more questions when we're at 5th, 15th, 25th question, etc.
    if (currentQuestionIndex > 0 && currentQuestionIndex % 5 === 0 && 
        questions.length <= currentQuestionIndex + 5) {
      loadQuestions();
    }
  }
  
  function checkAnswer() {
    if (!questions[currentQuestionIndex] || userAnswer.trim() === '') return;
    
    const correctAnswer = questions[currentQuestionIndex].answer;
    const userAnswerNum = parseInt(userAnswer);
    
    if (userAnswerNum === correctAnswer) {
      // Correct answer
      isIncorrect = false;
      isCorrect = true;
      currentStreak++;
      
      // Update longest streak if needed
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        if (browser) {
          sessionStorage.setItem('longestStreak', longestStreak.toString());
        }
      }
      
      // Save current streak to session storage
      if (browser) {
        sessionStorage.setItem('currentStreak', currentStreak.toString());
      }
      
      // Move to next question
      setTimeout(() => {
        currentQuestionIndex++;
        userAnswer = '';
        isCorrect = false;
      }, 800);
      
    } else {
      // Incorrect answer - make sure isIncorrect is reset before setting
      isCorrect = false;
      isIncorrect = false;
      
      // Use timeout to ensure the state change is detected
      setTimeout(() => {
        isIncorrect = true;
        currentStreak = 0;
        
        // Save current streak to session storage
        if (browser) {
          sessionStorage.setItem('currentStreak', '0');
        }
        
        // Clear the answer after the animation
        setTimeout(() => {
          userAnswer = '';
          isIncorrect = false;
        }, 600);
      }, 10);
    }
  }
  
  function handleNumberPadInput(value: string) {
    if (value === 'delete') {
      userAnswer = userAnswer.slice(0, -1);
    } else if (value === 'submit') {
      if (userAnswer.trim() === '') return; // Don't submit if empty
      checkAnswer();
    } else if (value === '-') {
      // Only add minus at the beginning
      if (userAnswer === '') {
        userAnswer = '-';
      }
    } else {
      userAnswer += value;
    }
  }
  
  function navigateToAbout() {
    goto('/about');
  }
</script>

<div class="min-h-screen bg-gray-100 flex flex-col items-center {isMobile ? 'pt-2 px-2 pb-0' : 'pt-8 px-4'}">
  <div class="flex items-center justify-center mb-6 w-full max-w-md relative">
    <a href="/" class="text-center">
      <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500">
        NumberMasters
      </h1>
    </a>
    <button 
      on:click={navigateToAbout}
      class="ml-2 text-xl rounded-full w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600"
      aria-label="About this game"
    >
      ?
    </button>
  </div>
  
  <div class="w-full max-w-md {isMobile ? 'flex flex-col flex-1' : ''}">
    <StreakTracker {currentStreak} {longestStreak} />
    
    {#if questions.length > currentQuestionIndex}
      <Question 
        question={questions[currentQuestionIndex].question} 
        bind:userAnswer 
        bind:isIncorrect
        bind:isCorrect
        on:submit={checkAnswer} 
      />
    {:else}
      <div class="text-center p-8 bg-white rounded-lg shadow">
        <p>Loading questions...</p>
      </div>
    {/if}
    
    {#if isMobile}
      <!-- Spacer that takes up remaining space on mobile -->
      <div class="h-2"></div>
      
      <NumberPad bind:userAnswer {isEmpty} on:input={e => handleNumberPadInput(e.detail)} />
    {/if}
  </div>
</div>