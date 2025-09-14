# SIE Frontend Interface Design

## Core Components

1. **Display Area**
   - Shows the current question and any hints from the backend.

2. **Input Box**
   - Allows the user to type and submit their answer.

3. **Submit Button**
   - Sends the answer to the backend for validation.

4. **Next Question Button**
   - Requests a new question from the backend API.

5. **Feedback Area**
   - Displays validation results or feedback from the backend.

## Recommended Flow

- User clicks "Next Question" to fetch a new question from `/api/ai/generate-question`.
- The question and hints are displayed in the Display Area.
- User enters their answer in the Input Box and clicks "Submit".
- The answer is sent to `/api/ai/validate-response` for validation.
- Feedback from the backend is shown in the Feedback Area.

## Implementation Options

- **Simple:** Use HTML/JS for a basic interface.
- **Advanced:** Use a frontend framework (React, Vue, etc.) for a richer experience.

Let the developer know your preference to get started with the implementation.
