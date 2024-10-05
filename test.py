from pprint import pprint
from groq import Groq
from dotenv import load_dotenv
import os
load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

PROMPT_RECIPE = "print 20 breakfast lunch or dinner recipes names with up to five ingredients each, such that one is less than 10leva. Must print only recipes on separate single rows, starting with !, where a row contains only recipe name and ingredient list. Separate each recipe from the rest with --- and on each row separate the recipe from the ingredients with ||| the ingredients need to be comma separated."

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

def recipe():
    return chat(PROMPT_RECIPE, client)


def parse_recipes(recipes_str):
    recipes_list = []
    recipes = recipes_str.split('---')
    
    for recipe in recipes:
        if recipe.strip() and recipe.strip().startswith('!'):
            name, ingredients = recipe.split('|||')
            name = name.strip()
            ingredients = [ingredient.strip() for ingredient in ingredients.split(',')]
            recipes_list.append({'name': name, 'ingredients': ingredients})
    
    return recipes_list

recipes = recipe()

print (recipes)

pprint(parse_recipes(recipes))

print("test")
