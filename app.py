
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/post-data', methods=['POST'])
def handle_post_data():
    # Extract data from the request body (JSON)
    data = request.json
    
    # Extract individual fields
    budget = data.get('budget')
    preferences = data.get('preferences')
    exclude = data.get('exclude')
    calories = data.get('calories')

    # Prepare a response message based on received data
    response_message = (
        f"Received weekly budget: {budget} BGN, "
        f"personal preferences: {preferences}, "
        f"things to exclude: {exclude}, "
        f"daily calorie intake: {calories}"
    )

    # Return the response in JSON format
    return jsonify({'message': response_message})

if __name__ == '__main__':
    app.run(debug=True)
