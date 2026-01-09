// Landing page data constants

export interface FAQItem {
    question: string;
    answer: string;
}

export interface Testimonial {
    name: string;
    role: string;
    text: string;
    avatar: string;
}

export interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: "primary" | "orange";
}

export const faqData: FAQItem[] = [
    {
        question: "What is QuickEase?",
        answer:
            "QuickEase is an AI-powered study assistant developed as a capstone project. It uses OpenAI GPT-4o, Google Vision, and ConvertAPI to automatically generate summaries, flashcards, and quizzes from your uploaded study materials.",
    },
    {
        question: "Is the web and mobile app synchronized?",
        answer:
            "Yes! Your notes, flashcards, and progress sync in real-time between the web app and Android mobile app.",
    },
    {
        question: "Does QuickEase work offline?",
        answer:
            "The Android app supports offline mode. Access downloaded materials without internet—changes sync when you reconnect.",
    },
    {
        question: "What file formats are supported?",
        answer:
            "You can upload PDFs, images (JPG, PNG), and plain text. Our AI extracts and processes the content automatically.",
    },
    {
        question: "Is QuickEase free to use?",
        answer:
            "Yes! QuickEase is completely free. It was built as an academic project to help students study more effectively.",
    },
];

export const testimonials: Testimonial[] = [
    {
        name: "Panel Member",
        role: "Capstone Defense",
        text: "The system demonstrates excellent functional suitability and usability. The AI integration is impressive.",
        avatar: "/images/sadboi.png",
    },
    {
        name: "User Testing Participant",
        role: "College Student",
        text: "The Pomodoro timer and badge system kept me motivated. I actually enjoyed studying for once!",
        avatar: "/images/sadboi.png",
    },
    {
        name: "Early Adopter",
        role: "Engineering Student",
        text: "Uploading my notes and getting instant flashcards saved me hours of preparation time. Game changer.",
        avatar: "/images/sadboi.png",
    },
];
