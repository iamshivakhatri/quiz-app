"use client";
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '@/context/global-context';
import { useParams, useRouter } from "next/navigation";

// Define the type for the quiz question
type Question = {
    id: number;
    question: string;
    options: string[];
    answer: string;
};

const Quiz = () => {
    // Define quiz questions and answers

    const router = useRouter();
    const questions: Question[] = [
        {
            "id": 1,
            "question": "What is the key difference between git fork and git clone as explained by Cameron McKenzie",
            "options": [
                "Amount of control over repository",
                "Number of repositories",
                "Type of files",
                "GitHub URLs"
            ],
            "answer": "Amount of control over repository."
        },
        {
            "id": 2,
            "question": "According to Cameron McKenzie, what can a developer do with the cloned repository",
            "options": [
                "Make changes",
                "Delete repository",
                "Rename repository",
                "Share repository"
            ],
            "answer": "Make changes."
        },
        {
            "id": 3,
            "question": "In the scenario described by Cameron McKenzie, what is the example repository owned by him called",
            "options": [
                "Cameron McNz",
                "J Guevara",
                "Rock Paper Scissors",
                "Java Revolutionary"
            ],
            "answer": "Cameron McNz."
        },
        {
            "id": 4,
            "question": "How does a developer obtain the GitHub URL necessary for cloning a repository",
            "options": [
                "Request from administrator",
                "Generate during clone",
                "Find in repository settings",
                "Locate in the README file"
            ],
            "answer": "Locate in the README file."
        },
        {
            "id": 5,
            "question": "After performing git add and git commit on the cloned repository, what is the next step described by Cameron McKenzie",
            "options": [
                "Git pull",
                "Git push",
                "Git merge",
                "Git branch"
            ],
            "answer": "Git push."
        }
    ]
    // Generate a unique ID for each participant
    const generateUniqueID = (): string => {
        return Math.random().toString(36).substr(2, 9);
    };

    // State to store participant's ID, selected answers, and score
    const { addUserData } = useGlobalContext();
    const [participantID, setParticipantID] = useState<string>('');
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [score, setScore] = useState<number>(0);

    // Effect to generate participant ID on component mount
    useEffect(() => {
        setParticipantID(generateUniqueID());
    }, []);

    // Function to handle answer selection
    const handleAnswerSelection = (questionID: number, selectedOption: string) => {
        setSelectedAnswers({ ...selectedAnswers, [questionID]: selectedOption });
    };

    // Function to calculate the score
    const calculateScore = () => {
        let newScore = 0;
        questions.forEach(question => {
            if (selectedAnswers[question.id] === question.answer) {
                newScore++;
            }
        });
        setScore(newScore);
        addUserData({ userId: participantID, score: newScore });
        router.push(`/results`)
        router.refresh();
    };

    // Render quiz questions and options
    const renderQuestions = () => {
        return questions.map(question => (
            <div key={question.id} className="mb-6 p-4 bg-white shadow-md rounded-md">
                <p className="mb-2">{question.question}</p>
                <div className="grid grid-cols-1 gap-4 max-w-sm">
                    {question.options.map(option => (
                        <button
                            key={option}
                            className={`border rounded-md px-4 py-2 ${selectedAnswers[question.id] === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleAnswerSelection(question.id, option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-4">Quiz</h1>
            <p className="mb-4">Take the quiz to test your knowledge</p>
            {/* Participant ID */}
            <p className="mb-4">Your ID: {participantID}</p>
            {/* Quiz Questions */}
            {renderQuestions()}
            {/* Submit button */}
            <button
                className="bg-green-500 text-white rounded-md px-4 py-2 mt-4"
                onClick={calculateScore}
            >
                Submit Answers
            </button>
            {/* Score */}
            {score > 0 && <p className="mt-4">Your score: {score}</p>}
        </div>
    );
};

export default Quiz;
