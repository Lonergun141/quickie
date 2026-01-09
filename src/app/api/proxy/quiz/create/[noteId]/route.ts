import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// POST - Generate quiz from note summary using OpenAI, then save to backend
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ noteId: string }> }
) {
    try {
        const { noteId } = await params;
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const { summary } = await req.json();

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!summary) {
            return NextResponse.json({ message: "Summary is required" }, { status: 400 });
        }

        if (!OPENAI_API_KEY) {
            return NextResponse.json({ message: "OpenAI API key not configured" }, { status: 500 });
        }

        // Step 1: Generate quiz using OpenAI
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that generates multiple-choice quizzes in pure JSON format. Return only JSON, without any code blocks, markdown, or extra characters.",
                    },
                    {
                        role: "user",
                        content: `Generate a multiple-choice quiz based on the given summary. The number of questions should be exactly either "15 or 20" items only. 
                        If the given summary is too short, generate 15. Else, generate 20 items if it's a long summary. 

                        Ensure the following:
                        - Cover all major points and details, ensure an even distribution of topics.
                        - Each question must have **1 correct answer** and **3 incorrect options (distractors)**.
                        - The distractor should be plausible and reasonable.
                        - Randomize the position of the correct answer among the four choices for each question.
                        
                        Format the response as a JSON array:
                        [
                            {
                                "TestQuestion": "Question text here",
                                "choices": [
                                    { "item_choice_text": "Choice text", "isAnswer": boolean },
                                    { "item_choice_text": "Choice text", "isAnswer": boolean },
                                    { "item_choice_text": "Choice text", "isAnswer": boolean },
                                    { "item_choice_text": "Choice text", "isAnswer": boolean }
                                ]
                            }
                        ]

                        Summary:
                        "${summary}"`,
                    },
                ],
                max_tokens: 5000,
            }),
        });

        if (!openaiResponse.ok) {
            const error = await openaiResponse.json();
            console.error("OpenAI error:", error);
            return NextResponse.json({ message: "Failed to generate quiz" }, { status: 500 });
        }

        const openaiData = await openaiResponse.json();
        const quizContent = openaiData.choices[0].message.content.trim();

        let quizData;
        try {
            quizData = JSON.parse(quizContent);
        } catch {
            console.error("Failed to parse quiz JSON:", quizContent);
            return NextResponse.json({ message: "Invalid quiz format from AI" }, { status: 500 });
        }

        // Step 2: Create UserTest in backend
        const testResponse = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-create/${noteId}/`, {
            method: "POST",
            headers: {
                "Authorization": `JWT ${access}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        if (!testResponse.ok) {
            const error = await testResponse.json();
            console.error("Backend test creation error:", error);
            return NextResponse.json({ message: "Failed to create test" }, { status: 500 });
        }

        // Step 3: Create questions and choices
        for (const question of quizData) {
            const questionResponse = await fetch(`${BACKEND_URL}/quickease/api/v1/questions/create/${noteId}/`, {
                method: "POST",
                headers: {
                    "Authorization": `JWT ${access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ TestQuestion: question.TestQuestion }),
            });

            if (questionResponse.ok) {
                const questionData = await questionResponse.json();
                const questionId = questionData.id;

                for (const choice of question.choices) {
                    await fetch(`${BACKEND_URL}/quickease/api/v1/usertest/choice-create/${questionId}/`, {
                        method: "POST",
                        headers: {
                            "Authorization": `JWT ${access}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            item_choice_text: choice.item_choice_text,
                            isAnswer: choice.isAnswer,
                        }),
                    });
                }
            }
        }

        return NextResponse.json({ message: "Quiz created successfully", questions: quizData.length }, { status: 201 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
