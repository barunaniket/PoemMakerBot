import google.generativeai as genai

api_key = "AIzaSyC210KRfOwi2wdKtb1skumzakbajrHQkqw" # Replace this
genai.configure(api_key=api_key)

model_name = 'gemini-2.0-flash-lite'
try:
    model = genai.GenerativeModel(model_name)
except Exception as e:
    print(f"Error: Could not load model '{model_name}'.  Check the model name and your API key.")
    print(f"Error details: {e}")
    exit()

direction = input("Direction (boy to girl, girl to boy): ")
recipient_name = input("Recipient's name: ")
theme = input("Theme (friendship, love, etc.): ")
num_lines = input("Number of lines: ")
rhyme_scheme = input("Rhyme scheme (e.g., ABAB, AABB, None): ")
language_style = input("Language style (simple, modern, minimalist, etc.): ")

prompt = f"""
Write a {num_lines}-line poem in {language_style} style with a {rhyme_scheme} rhyme scheme. 
The theme of the poem is "{theme}". 

This poem is for {recipient_name}.  
The poem is written by the {direction}.  

Include vivid imagery and emotional depth that matches the tone of the theme.  
Ensure the poem feels personal and heartfelt, as if it's being written specifically for the recipient.
"""
print("Creating Poem...")

try:
    response = model.generate_content(prompt)
except Exception as e:
    print(f"Error: Could not generate content.  Check your API key and model availability.")
    print(f"Error details: {e}")
    exit()

print("\nHere's your poem:\n")
print(response.text)