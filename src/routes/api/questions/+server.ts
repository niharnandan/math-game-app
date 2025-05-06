import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CLAUDE_API_KEY } from '$env/static/private';
import axios from 'axios';

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    // Define system prompt for Claude
    const systemPromptContent = `
      You are a difficult math question generator for adults. Generate 10 math problems with their answers.
      Each problem should have 1 to 4 operators (+ - × ÷) and numbers between -10 and 50.
      Questions should involve order of operations (PEMDAS). The answers can be negative from -50 to 50. If multiplying or dividing
      with a negative number, be sure to write the question as 4 × (-2) with parenthesis around the negative number.
      Format your response as a valid JSON array with this structure:
      [
        {"question": "12 + 4 × 5", "answer": 32},
        {"question": "40 - 8 ÷ 2", "answer": 36}
        {"question": "4 - 8", "answer": -4}
      ]
      Only return the JSON array, nothing else.
    `;

    // Check if API key is configured
    if (!CLAUDE_API_KEY) {
      console.error('Claude API key is missing');
      // Return fallback questions if API fails
      return json({ 
        questions: [
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
        ]
      });
    }

    console.log('Making request to Claude API with key length:', CLAUDE_API_KEY?.length);
    
    try {
      // Call the Claude API - key fixes:
      // 1. System prompt should be a string, not in messages
      // 2. Messages should be an array with proper format
      const claudeResponse = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: systemPromptContent,
          messages: [{
            role: 'user',
            content: 'Generate 10 math problems for kids with their answers'
          }],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          timeout: 30000, // 30 second timeout
        },
      );
      
      console.log('Claude API response received:', claudeResponse.status);
      
      // With axios, we access data directly, not via .json()
      const data = claudeResponse.data;
      
      // Extract the JSON array from Claude's response
      const content = data.content[0].text;
      const questionsArray = JSON.parse(content);

      console.log('HERE', questionsArray);
      
      return json({ questions: questionsArray });
    } catch (apiError: any) {
      console.error('Error calling Claude API:', apiError.message);
      
      if (apiError.response) {
        console.error('Response error details:', {
          status: apiError.response.status,
          data: apiError.response.data
        });
      }
      
      // Return fallback questions if API fails
      return json({ 
        questions: [
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
        ]
      });
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Return fallback questions if API fails
    return json({ 
      questions: [
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
      ]
    });
  }
};