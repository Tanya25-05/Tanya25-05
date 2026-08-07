import os
from openai import OpenAI

# Initialize the client with ZenMux base URL and your API key
client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key=os.environ.get("ZENMUX_API_KEY") # Or hardcode your key string here
)

# Keep track of conversation history for a true chat session
messages = [{"role": "system", "content": "You are a helpful assistant."}]

print("--- Started Kimi K3 CLI Session (Type 'exit' or 'quit' to stop) ---")

while True:
    user_input = input("\nYou: ")
    if user_input.lower() in ['exit', 'quit']:
        print("Ending session. Goodbye!")
        break

    if not user_input.strip():
        continue

    # Append the new prompt to the history
    messages.append({"role": "user", "content": user_input})

    try:
        response = client.chat.completions.create(
            model="moonshotai/kimi-k3-free",
            messages=messages
        )

        reply = response.choices[0].message.content
        print(f"\nKimi K3: {reply}")

        # Append the assistant's reply to maintain context
        messages.append({"role": "assistant", "content": reply})

    except Exception as e:
        print(f"\nError: {e}")