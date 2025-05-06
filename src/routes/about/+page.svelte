<script lang="ts">
    import { goto } from '$app/navigation';
  </script>
  
  <div class="min-h-screen bg-gray-100 flex flex-col items-center pt-8 px-4">
    <div class="w-full max-w-2xl">
      <div class="flex items-center justify-center mb-8">
        <a href="/" class="text-center">
          <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            NumberMasters
          </h1>
        </a>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">About This Game</h2>
        
        <div class="space-y-4 text-gray-700">
          <p>
            <span class="font-semibold">NumberMasters</span> is an endless math practice 
            game designed to help sharpen mathematical skills through fun, interactive challenges.
          </p>
          
          <h3 class="text-xl font-semibold mt-6 text-gray-800">Key Features</h3>
          
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <span class="font-medium">Infinite Questions:</span> Never run out of practice problems. 
              Our AI-powered system generates new math questions on demand.
            </li>
            
            <li>
              <span class="font-medium">AI-Generated Content:</span> Questions are dynamically created by 
              Claude AI, ensuring variety and appropriate difficulty.
            </li>
            
            <li>
              <span class="font-medium">Streak Tracking:</span> Build your confidence by tracking consecutive 
              correct answers and competing against your personal best.
            </li>
            
            <li>
              <span class="font-medium">Mobile & Desktop Friendly:</span> Practice your math skills anywhere 
              with a responsive design that works on all devices.
            </li>
            
            <li>
              <span class="font-medium">Order of Operations Practice:</span> Each problem helps reinforce 
              PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction) rules.
            </li>
          </ul>
          
          <h3 class="text-xl font-semibold mt-6 text-gray-800">Technical Details</h3>
          
          <p>
            This application demonstrates efficient use of AI for educational content generation. Questions 
            are batch-requested from Claude AI in the background, ensuring a smooth user experience with 
            no waiting for new problems.
          </p>
          
          <p>
            Built with Svelte, the app features a lightweight, fast interface that works well even on 
            lower-powered devices. The custom number pad ensures a consistent input experience across 
            all platforms.
          </p>
          
          <div class="mt-8 text-center">
            <a href="/" class="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors">
              Start Practicing Now
            </a>
          </div>
        </div>
      </div>
      
      <div class="text-center text-gray-500 text-sm mb-8">
        &copy; 2025 NumberMasters. All rights reserved.
      </div>
    </div>
  </div>