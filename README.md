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

Đoạn mã
GENAI_API_KEY=your_api_key_here
4. Run the Flask Server

Bash
python app.py
Open your browser and navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000) to chat with the AI!

💡 Example Prompts to Try
"Analyze our internal customer data."

"Predict churn for a 30-year-old customer who made 5 support calls."

"Draw a bar chart comparing the average salaries of IT, Marketing, and Sales in Vietnam."
