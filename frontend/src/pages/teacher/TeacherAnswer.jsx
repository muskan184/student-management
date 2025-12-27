import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../api/questionApi";
import { addAnswer, fetchAnswers } from "../../api/answerApi";

export default function TeacherAnswer() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const load = async () => {
      const q = await fetchQuestionById(id);
      const a = await fetchAnswers(id);
      setQuestion(q);
      setAnswers(a);
    };
    load();
  }, [id]);

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    await addAnswer(id, { content: answer });

    const updated = await fetchAnswers(id);
    setAnswers(updated);
    setAnswer("");
  };

  if (!question) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold">{question.title}</h1>
        <p className="mt-2">{question.description}</p>
      </div>

      {/* Existing Answers */}
      <div className="mt-4">
        <h2 className="font-semibold mb-2">Answers</h2>
        {answers.map((a) => (
          <div key={a._id} className="bg-white p-3 mb-2 rounded shadow">
            {a.content}
          </div>
        ))}
      </div>

      {/* Teacher Answer Box */}
      <textarea
        className="w-full p-3 border rounded mt-4"
        rows="4"
        placeholder="Write your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button
        onClick={submitAnswer}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Answer
      </button>
    </div>
  );
}
