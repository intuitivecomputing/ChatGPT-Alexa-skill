# ChatGPT-Alexa-skill

## Setting up OpenAI API
1. Create an account at https://platform.openai.com/ to get access to OpenAI API.
2. Create a new api key here: Account -> View API keys -> Create new secret key.. Link: https://platform.openai.com/account/api-keys.
3. Copy and paste the key in: lambda> index.js -> const authToken = 'Bearer <YOUR_OPEN_AI_KEY>'; Replace <YOUR_OPEN_AI_KEY>.

## Creating Alexa skill
1. Create alexa developer account and log into the the console. 
2. Create new skill with following parameters:

    a. Type of experience: **Other**
    
    b. Model: **Custom**
    
    c. Hosting services: **Alexa-hosted (Node.js)**
    
    d. Templates: **Start from scratch**
    
3. Once cretaed. Edit the skill as following in **"Build"** tab:

    a. Invocation name: chat g p t. Note: can use any invocation name to invoke/open skill. I created routines to use more natural phrases for activating the skill (see below) since the invocation in alexa skills is limited to certain rules. 
    
    b. Within **Build** tab add intent to query chatGPT: Build -> Interation Model -> Intents -> Add Intent . name the intent "AskChatGPTIntent".
    
    c. Add phrases and define the slot {question} to cature user question/query to be sent to chatGPT API. e.g., "**{question}**", "**Alexa, {question}**", "**get me        a {question}**". Read more about intents in alexa documentation: https://developer.amazon.com/en-US/docs/alexa/custom-skills/create-intents-utterances-and-slots.html
    
    d. Set the slot type to AMAZON.SearchQuery **"question"**.
    
    e. **Save** and **build** the model. You can also **Evaluate** the model to see how the intents will work.
    
4. In the **"Code"** tab, import the .zip the above archive with lambda folder in it using "Import Code". Save and Deploy! As soon as you deploy the skill is accessbile on all the devices that are linked to your amazon account.

6. Chat GPT skill can now be called using the invocation phrase e.g. "**Alexa, open chat g p t**". You can test the code in Alexa simulator in the  "Test" tab. Set 'skill testing is enabled in: " to Development. 

Note: the skill behavior is best on the Amazon echo dot. Behavior is little different in simulator. So, be sure to test it on the echo dot. 

As of April 3, 2023: if OpenAI API takes longer than 8 secs to respond the Alexa skill times out and you get a response " There was a problem with the requested skill's response". Working on it to fix it. 

## Creating Routine on Amazon Echo 
to invoke chatGPT more naturally...

Due to limitations of invocation naming conventions, I use Alexa routine to invoke/open the chatGPT skill more naturally:

On your Alexa app on the phone, create a routine: More -> Routines -> + .. 

1. Set **routine name** to chatGPT. 
2. Set "**When this happens**" -> voice -> enter different phrases that can be used to activate the skill such as : "I have a question", " Can you answer a question", "let's chat". 
3. Set "**Add action**" -> Custom -> "Alexa, open <Invocation name>" ... "Alexa, open chat g p t".

Now you can open ChatGPT Alexa skill by saying more natural phrases such as "**Alexa, I have a question**" and "**Alexa, let's chat**".. 
