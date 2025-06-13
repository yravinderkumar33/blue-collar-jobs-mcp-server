import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt: any = PromptTemplate.fromTemplate(`
You are a data transformation engine for blue-collar job data normalization. Your task is to transform input data from one JSON schema to another.

INSTRUCTIONS:
1. Analyze the input data structure using the provided inputSchema
2. Transform the data to match the outputSchema exactly
3. Preserve all meaningful information during transformation
4. Apply appropriate data type conversions when needed
5. Use null for missing required fields that cannot be inferred
6. Ensure the output strictly conforms to the outputSchema

IMPORTANT:
- Return ONLY valid JSON without any explanation, markdown, or additional text
- The output must validate against the outputSchema
- Maintain data integrity and accuracy throughout the transformation

INPUT DATA:
{data}

INPUT SCHEMA:
{inputSchema}

OUTPUT SCHEMA:
{outputSchema}
`);

const model: any = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
});

const chain: any = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser()
])

export default chain;
