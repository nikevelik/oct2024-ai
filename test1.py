
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


PROMPT_RECIPE = "Return exactly {count} recipe names for breakfast, lunch, or dinner, each with up to {ingredient_limit} ingredients, at a {adjective_price} price. The meals should be appropriate for a diet aiming at {daily_calorie_count} daily calorie intake. Return only markdown table with all the entries in columns: 1. Meal name, 2. ingredients"

PROMPT_PRICES = "Based on the given list of ingredients prices in the list, Return a table with columns: 1. meal name, 2. ingredients, 3. estimated price for 500g of the meal. The rows must be sorted by the third column in ascending order. Do not add any explanations or anything in your response besides the table. Return the middle 10 options from the table. I don't want nothing in this response exept for the markdown table, NO text before or after it!!!"

def chat(message, client):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": message,
            }
        ],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content

def meals_ingredients(count, ingredient_limit, price, calories):
    return chat(PROMPT_RECIPE.format(count=count, ingredient_limit=ingredient_limit, adjective_price = get_budget_adj(price), daily_calorie_count = calories), client)

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

def instructions_and_object(txt):
    return chat("generate a `const meals` JS OBJECT, AND GENARATE TO EACH ENTRY FOR EACH MEAL EXPLAINATION FOR PREPARATION INSTRUCTIONS AND TIME NEEDED. # **do this for every entry in the input from beginning to end so that the object contains all the info FOR SURE**" + txt, client)

meals = meals_ingredients(count, ingredient_limit, price, calories)
# print(meals)



# print("\n\n\n\n\n\n\n\n\n\n\n")
with_prices = (add_prices(meals))

data =  (instructions_and_object(with_prices))
print(data)

def strip(js_string):
    # Use a regular expression to find the "const meals = {...}" part
    match = re.search(r'const meals\s*=\s*([.*?]);', js_string, re.DOTALL)
    if match:
        # Get the JSON-like string inside the match
        meals_string = match.group(1)
        
        # Replace single quotes with double quotes (if any)
        meals_string = meals_string.replace("'", '"')
        
        # Remove trailing commas before closing braces
        meals_string = re.sub(r',\s*}', '}', meals_string)
        meals_string = re.sub(r',\s*$', '', meals_string)  # Remove trailing comma at the end of the string if exists

        try:
            # Convert it to a Python dictionary
            meals_dict = json.loads(meals_string)
            return meals_dict
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return None
    return None

print("\n\n\n\n\n\n\n\n\n\n\n")
print(strip(data))

