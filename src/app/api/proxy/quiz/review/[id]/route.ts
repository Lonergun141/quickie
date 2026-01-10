import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const access = cookieStore.get("quickie_access_token")?.value;
        const { id } = await params;

        if (!access) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const headers = {
            "Authorization": `JWT ${access}`,
            "Content-Type": "application/json",
        };

        // 0. Resolve UserTest ID
        // The /usertest-detail/ endpoint might require the UserTest ID, but we have the Note ID.
        // We'll fetch all user quizzes and find the one that corresponds to this note.
        // This is a workaround if /usertest-detail/ doesn't support Note ID lookup.
        let testId = id;
        try {
            const quizzesRes = await fetch(`${BACKEND_URL}/quickease/api/v1/user-quizzes/`, { headers });
            if (quizzesRes.ok) {
                const quizzes = await quizzesRes.json();
                // Check if 'note' is the full object or just ID. Compare as strings.
                // We assume 'note' field in quiz matches 'id' param.
                const match = quizzes.find((q: any) => String(q.note) === id || (q.note && String(q.note.id) === id));
                if (match && match.id) {
                    testId = match.id;
                    console.log(`Resolved Note ID ${id} to UserTest ID ${testId}`);
                }
            }
        } catch (e) {
            console.warn("Failed to resolve UserTest ID from list, using Note ID directly.");
        }

        // 1. Fetch UserTest Details
        // Try with resolved ID
        let userTestRes = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-detail/${testId}/`, { headers });

        // If 404 and we switched ID, try original ID just in case
        if (!userTestRes.ok && testId !== id) {
            console.log("Fetch with TestID failed, retrying with NoteID");
            userTestRes = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest-detail/${id}/`, { headers });
        }

        if (!userTestRes.ok) {
            console.error(`Failed to fetch user test details. URL: ${userTestRes.url} Status: ${userTestRes.status}`);
            const text = await userTestRes.text();
            throw new Error(`Failed to fetch user test: ${userTestRes.status} ${text.substring(0, 100)}`);
        }
        const userTest = await userTestRes.json();

        // 2. Fetch Questions (Uses Note ID)
        const questionsRes = await fetch(`${BACKEND_URL}/quickease/api/v1/question-by-note/${id}/`, { headers });
        if (!questionsRes.ok) {
            throw new Error(`Failed to fetch questions: ${questionsRes.status}`);
        }
        const questions = await questionsRes.json();

        // 3. Fetch Choices & Answers (Parallel)
        const choicesByQuestion: { [key: number]: any } = {};

        await Promise.all(questions.map(async (q: any) => {
            const choicesRes = await fetch(`${BACKEND_URL}/quickease/api/v1/usertest/choices/${q.id}/`, { headers });
            if (choicesRes.ok) {
                choicesByQuestion[q.id] = await choicesRes.json();
            }
        }));

        let answersByNoteRes = await fetch(`${BACKEND_URL}/quickease/api/v1/answer-by-note/${id}/`, { headers });

        // If 404/Empty and we have a different testId, try that
        if ((!answersByNoteRes.ok || answersByNoteRes.status === 404) && testId !== id) {
            console.log("Fetch answers with NoteID failed, retrying with TestID");
            answersByNoteRes = await fetch(`${BACKEND_URL}/quickease/api/v1/answer-by-note/${testId}/`, { headers });
        }

        let answersByNote = [];
        if (answersByNoteRes.ok) {
            answersByNote = await answersByNoteRes.json();
        } else {
            console.error(`Failed to fetch answers. URL: ${answersByNoteRes.url} Status: ${answersByNoteRes.status}`);
        }

        const reviewData = {
            userTest,
            questions,
            choicesByQuestion,
            answersByNote
        };

        return NextResponse.json(reviewData, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching quiz review:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
