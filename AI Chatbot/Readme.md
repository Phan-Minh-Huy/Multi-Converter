
🚀 AI Manager Assistant (Customer Churn Prediction)
A modern, full-stack web application that serves as an intelligent virtual assistant for business managers. It integrates Google Gemini's advanced Function Calling with a custom Machine Learning pipeline to analyze data, predict customer churn, and generate dynamic visualizations—all through a natural, conversational interface.

✨ Key Features
💬 AI-Powered Conversational UI: A seamless, responsive web interface utilizing a modern Glassmorphism design system.

🧠 Predictive Analytics (Machine Learning): Uses a built-in RandomForestClassifier to evaluate customer friction (e.g., support calls, age) and predict the likelihood of service churn.

📊 Dynamic Data Visualization: Automatically processes natural language requests to draw custom charts and graphs using matplotlib, bypassing browser caching for real-time image rendering.

⚙️ Autonomous Function Calling: Powered by the Gemini 3.1 Flash API, the AI dynamically decides when to chat naturally and when to trigger local Python analytics scripts.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Glassmorphism UI, smooth animations), Vanilla JavaScript, marked.js (for Markdown & inline image parsing).

Backend: Python, Flask.

Data Science & ML: pandas, numpy, scikit-learn (Random Forest).

AI Integration: Google Generative AI API (gemini-3.1-flash-lite-preview).

Environment Management: python-dotenv.

How to Run Locally
1. Clone the repository

Bash
git clone https://github.com/your-username/ai-manager-assistant.git
cd ai-manager-assistant
2. Install dependencies

Bash
pip install -r requirements.txt
3. Configure Environment Variables
Create a .env file in the root directory and add your Google Gemini API Key:


GENAI_API_KEY=your_api_key_here
4. Run the Flask Server

Bash
python app.py
Open your browser and navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000) to chat with the AI!

💡 Example Prompts to Try
"Analyze our internal customer data."

"Predict churn for a 30-year-old customer who made 5 support calls."

"Draw a bar chart comparing the average salaries of IT, Marketing, and Sales in Vietnam."
