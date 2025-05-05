from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# 1. Set your Gemini API key (Directly in the code - Be careful!)
api_key = "AIzaSyBW3pQrM9RaGWWpE3W8-h8yktN56ekP4WY"  # Replace with your actual API key!  **VERY IMPORTANT: DO NOT SHARE THIS CODE WITH YOUR API KEY.**

genai.configure(api_key=api_key)

# 2. Define the Gemini Model
model_name = 'gemini-pro'  # Replace with the correct model name

# 3. Define generate_poem as a standalone function
def generate_poem(direction, recipient_name, theme, num_lines, rhyme_scheme, language_style):
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        print(f"Error: Could not load model '{model_name}'. Check model name and API key.")
        print(f"Error details: {e}")
        return {"error": f"Could not load model: {e}"}  # Return error if the model won't load

    prompt = f"""
    Write a {num_lines}-line poem in {language_style} style with a {rhyme_scheme} rhyme scheme.
    The theme of the poem is "{theme}".
    This poem is for {recipient_name}.
    The poem is written by the {direction}.
    Include vivid imagery and emotional depth that matches the tone of the theme.
    Ensure the poem feels personal and heartfelt, as if it's being written specifically for the recipient.
    """

    try:
        response = model.generate_content(prompt)
        return {"poem": response.text}  # Return poem in JSON format
    except Exception as e:
        print(f"Error generating content: {e}")
        return {"error": f"Error generating poem: {e}"}  # Return error if poem generation fails

# 4. Define the route that your JS will use
@app.route('/generate_poem', methods=['POST'])
def generate_poem_route():
    try:
        # Get the data sent from the JavaScript (in JSON format)
        data = request.get_json()

        # Call your generate_poem function
        poem_result = generate_poem(
            direction=data['direction'],
            recipient_name=data['recipient_name'],
            theme=data['theme'],
            num_lines=data['num_lines'],
            rhyme_scheme=data['rhyme_scheme'],
            language_style=data['language_style']
        )

        # Return the poem (or error) as a JSON response
        return jsonify(poem_result)
    except Exception as e:
        print(f"Error in generate_poem_route: {e}")
        return jsonify({"error": f"Internal Server Error: {e}"}), 500  # Return a 500 status code for server errors

if __name__ == '__main__':
    app.run(debug=True)