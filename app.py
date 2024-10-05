
from flask import Flask, request, jsonify
from flask_cors import CORS













from pprint import pprint
from groq import Groq
from dotenv import load_dotenv
import os
import json
import re 

load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

count = 60
ingredient_limit = 5
price = 170
calories = 2000




with open('a.csv', 'r') as file:
    lines = file.readlines()
    content = ''.join(lines)

# print(content)


PROMPT_RECIPE = "Return exactly {count} recipe names for breakfast, lunch, or dinner, each with up to {ingredient_limit} ingredients, at a {adjective_price} price. The meals should be appropriate for a diet aiming at {daily_calorie_count} daily calorie intake. Return only markdown table with all the entries in columns: 1. Meal name, 2. ingredients. USER SAID TO EXLUDE: {excluded} USER SAID TO INCLUDE: {included}"

PROMPT_PRICES = "Based on the given list of ingredients prices in the list, Return a table with columns: 1. meal name, 2. ingredients, 3. estimated price for 500g of the meal. The rows must be sorted by the third column in ascending order. Do not add any explanations or anything in your response besides the table. Return the middle 10 options from the table. I don't want nothing in this response exept for the markdown table, NO text before or after it!!!"

def chat(message, client):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": message,
            }
        ],
        model="gemma-7b-it",
    )
    return chat_completion.choices[0].message.content

def meals_ingredients(count, ingredient_limit, price, calories, excluded, included):
    return chat(PROMPT_RECIPE.format(count=count, ingredient_limit=ingredient_limit, adjective_price = get_budget_adj(price), daily_calorie_count = calories, excluded=excluded, included=included), client)


def add_prices(meals):
    return chat(PROMPT_PRICES + "# INGREDIENT_PRICES: " + content + "# MEALS WITH MAIN INGREDIENTS IN THEM: " + meals, client)
def get_budget_adj(budget_in_bgn):
    if(budget_in_bgn <= 70):
        return "very very cheap"
    if(budget_in_bgn <= 105):
        return "very cheap"
    if(budget_in_bgn <= 140):
        return "cheap"
    if(budget_in_bgn <= 210):
        return "normal"
    if(budget_in_bgn <= 280):
        return "decent"
    return "higher"


def with_explanation(data):
    return chat("return a new table, with the same things like this one. but add a column: preparation instructions and time. order by price, and return the 10 middle entries. MAKE YOUR RESPONSE START AND AND WITH THE TABLE, NO ADDITIONAL META TEXT. NO NOTE" + data, client)


# meals = meals_ingredients(count, ingredient_limit, price, calories)
# with_prices = (add_prices(meals))
# with_expl = (with_explanation(with_prices))
# print (with_expl)
















app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/post-data', methods=['POST'])
def handle_post_data():
    # Extract data from the request body (JSON)
    data = request.json
    
    # Extract individual fields
    budget = data.get('budget')
    include = data.get('include')
    exclude = data.get('exclude')
    calories = data.get('calories')

    meals = meals_ingredients(count, ingredient_limit, budget, calories, exclude, include)
    with_prices = (add_prices(meals))
    with_expl = (with_explanation(with_prices))
# print (with_expl)

    # Return the response in JSON format
    return jsonify({'message': with_expl})

if __name__ == '__main__':
    app.run(debug=True)
