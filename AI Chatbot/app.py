import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify, make_response
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
os.makedirs('static', exist_ok=True)



# Part 1: SETTING UP DATA AND MODELS FOR AI

ml_model = None
customer_df = None
chat_session = None

def setup_data_and_model():
    global ml_model, customer_df
    
    # 1. READ CUSTOMER DATA FROM CSV
    try:
        customer_df = pd.read_csv('customer_data.csv')
    except FileNotFoundError:
        print("Error: File not found. Please ensure the CSV file is in the same directory as app.py")
        return
    
    # 2. PREPARE DATA FOR MACHINE LEARNING
    try:
        X = customer_df[['age', 'support_calls']]
        y = customer_df['churn']
        
        ml_model = RandomForestClassifier(random_state=42)
        ml_model.fit(X.values, y.values)
        print("Machine learning model trained successfully.")
    except KeyError as e:
        print(f"Error: Column {str(e)} not found in the CSV file. Please check the column names.")

# Part 2: AI FUNCTIONS FOR CHATBOTS


def analyze_customer_data() -> str:
    """Collect internal data and create your own charts."""
    if customer_df is None:
        return "System Error: The database is empty."

    total_customers = len(customer_df)
    churn_rate = (customer_df['churn'].sum() / total_customers) * 100
    avg_support_calls = customer_df['support_calls'].mean()
    
    plt.figure(figsize=(5, 3))
    customer_df['churn'].value_counts().plot(kind='bar', color=['#0E4CFF', '#ff4c4c'])
    plt.title('Customer Churn Distribution', fontsize=10)
    plt.xlabel('Status (0 = Retained, 1 = Churned)', fontsize=9)
    plt.ylabel('Number of Customers', fontsize=9)
    plt.xticks(rotation=0)
    plt.tight_layout()
    
    plot_path = os.path.join('static', 'churn_plot.png')
    plt.savefig(plot_path)
    plt.close()

    return (f"We have {total_customers} customers. Avg support calls: {avg_support_calls:.1f}. Churn rate: {churn_rate}%. "
            f"Here is the visual representation:<br><br><img src='/static/churn_plot.png' style='width:100%; border-radius:10px;'>")

def predict_customer_churn(age: int, support_calls: int) -> str:
    """Predict the likelihood of a customer churning."""
    if ml_model is None:
        return "System Error: Model not trained."

    prediction = ml_model.predict([[age, support_calls]])[0]
    if prediction == 1:
        return f"A customer aged {age} with {support_calls} support calls is HIGHLY LIKELY to churn."
    else:
        return f"A customer aged {age} with {support_calls} support calls is UNLIKELY to churn."

# CREATE CHARTS ACCORDING TO USER'S REQUIREMENTS
def generate_custom_chart(title: str, categories: list[str], values: list[float]) -> str:
    """
    Custom charting tool.
    YOU MUST PRINT THE MARKDOWN RESULT OF THIS FUNCTION INTO YOUR ANSWER.
    """
    plt.figure(figsize=(6, 4))
    
    colors = ['#0E4CFF', '#764ba2', '#a8edea', '#fed6e3', '#ff4c4c']
    colors = colors * (len(categories) // len(colors) + 1)
    
    plt.bar(categories, values, color=colors[:len(categories)])
    plt.title(title, fontsize=12, fontweight='bold', color='#333')
    plt.ylabel('Values / Units (Value)')
    plt.xticks(rotation=15)
    plt.tight_layout()
    
    plot_path = os.path.join('static', 'custom_plot.png')
    plt.savefig(plot_path)
    plt.close()
    return f"![{title}](/static/custom_plot.png)"

# Part 3: AI System &  Web Server
def init_ai():
    global chat_session
    api_key = "Enter your API key here" 
    genai.configure(api_key=api_key)
    
    model = genai.GenerativeModel(
        model_name='gemini-3.1-flash-lite-preview', 
        tools=[analyze_customer_data, predict_customer_churn, generate_custom_chart],
        
    )
    
    chat_session = model.start_chat(enable_automatic_function_calling=True)

@app.route("/style.css")
def serve_css():
    response = make_response(render_template("style.css"))
    response.headers['Content-Type'] = 'text/css'
    return response

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    if chat_session is None:
        return jsonify({"response": "Error: The AI ​​system is not ready."})

    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"response": "Please enter a message."})

    try:
        response = chat_session.send_message(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"response": f"Technical error: {str(e)}"})

if __name__ == "__main__":
    setup_data_and_model()
    init_ai()
    print("Web server MVP is running... Open your browser at: http://127.0.0.1:5000")
    app.run(debug=True)
