import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Trash2, Edit, XCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { fetchQuestionById } from "../../../api/questionApi";
import { addAnswer, deleteAnswer, updateAnswer } from "../../../api/answerApi";
import { PiFloppyDisk } from "react-icons/pi";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentQuestion } = useOutletContext();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState("");

  /* ================= FETCH QUESTION & ANSWERS ================= */
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchQuestionById(id);
      setQuestion(res.question);
      setAnswers(res.answers || []);
    } catch (err) {
      toast.error("Failed to load question");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question?.text) {
      setCurrentQuestion(question.text);
    }
  }, [question]);

  /* ================= ADD ANSWER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Answer cannot be empty");

    try {
      await addAnswer(id, { content });
      toast.success("Answer added");
      setContent("");
      loadData();
    } catch {
      toast.error("Failed to add answer");
    }
  };

  /* ================= UPDATE ANSWER ================= */
  const handleUpdate = async (answerId) => {
    if (!editAnswerText.trim()) return toast.error("Answer cannot be empty");

    try {
      await updateAnswer(answerId, { content: editAnswerText });
      toast.success("Answer updated");
      setEditingAnswerId(null);
      setEditAnswerText("");
      loadData();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ANSWER ================= */
  const handleDelete = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;

    try {
      await deleteAnswer(answerId);
      toast.success("Answer deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!question) return null;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border rounded">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-semibold">Question Details</h1>
      </div>

      {/* QUESTION */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="font-semibold text-lg mb-2">Question</h2>
        <p className="text-gray-700">{question.text}</p>
      </div>

      {/* ANSWERS */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-lg">Answers</h3>

        {answers.length === 0 ? (
          <p className="text-gray-500">No answers yet</p>
        ) : (
          answers.map((ans) => {
            const isOwner =
              ans.answeredBy?._id === user?.id && ans.role !== "AI";
            const isEditing = editingAnswerId === ans._id;

            return (
              <div
                key={ans?._id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex  justify-between  items-start mb-3">
                  <Link to={ans.role !== "AI" ? `/profile/${ans.answeredBy?._id}` : ""} className="flex relative group items-center cursor-pointer hover:bg-gray-200 py-2 px-3 rounded-md gap-3">

                  {
                    ans?.role !== "AI" ? 
                      <img
                      src={ans?.answeredBy?.profilePic || "/default-avatar.png"}
                      alt="User avatar"
                      className="w-10 h-10 ring-offset-1 ring-2 ring-blue-500 rounded-full object-cover"
                    /> : (
                      <div className="w-10 h-10 ring-offset-1 ring-2 text-gray-950 font-semibold ring-blue-500 bg-blue-200 rounded-full flex items-center justify-center">
                        AI
                      </div>
                    )
                  }
                  

                    <div className="leading-tight">
                      <p className="text-sm font-medium text-gray-800 hover:underline">
                        {ans.answeredBy?.name ||
                          (ans.role === "AI" ? "AI" : "Anonymous")}
                      </p>
                      <p className="text-xs text-gray-400">Answered</p>
                    </div>

                    <div className="absolute z-20 top-full left-0 mt-2 hidden group-hover:block">
                      <MiniCard
                        teacher={ans.answeredBy}
                        isFollowing={false}
                        onFollow={() => console.log("follow")}
                      />
                    </div>
                  </Link>

                  {isOwner && (
                    <div className="flex items-center gap-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdate(ans._id)}
                            className="text-green-600 hover:text-green-700"
                            title="Save"
                          >
                            <PiFloppyDisk size={20} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingAnswerId(null);
                              setEditAnswerText("");
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="Cancel"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingAnswerId(ans._id);
                              setEditAnswerText(ans.content);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit size={20} />
                          </button>

                          <button
                            onClick={() => handleDelete(ans._id)}
                            className="text-red-500 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                {isEditing ? (
                  <textarea
                    value={editAnswerText}
                    onChange={(e) => setEditAnswerText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {ans.content}
                  </p>
                )}
              </div>

            );
          })
        )}
      </div>

      {/* ADD ANSWER */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow">
        <label className="block mb-2 font-medium">Add your answer</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Write your answer..."
          className="w-full border px-3 py-2 rounded resize-none"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded"
          >
            <Send size={16} /> Submit
          </button>
        </div>
      </form>
    </div>
  );
}


const MiniCard = ({ teacher, isFollowing, onFollow }) => {
  if (!teacher) return null;

  return (
    <div className="w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img
          src={teacher.profilePic || "/default-avatar.png"}
          alt={teacher.name}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="leading-tight">
          <p className="text-sm font-semibold text-gray-800">
            {teacher.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {teacher.role} • {teacher.subject}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-4 text-center text-sm">
        <div>
          <p className="font-semibold text-gray-800">
            {teacher.followers?.length || 0}
          </p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {teacher.following?.length || 0}
          </p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {teacher.experience || 0}
          </p>
          <p className="text-xs text-gray-500">Years</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onFollow}
          className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700"
        >
          {isFollowing ? "Following" : "Follow"}
        </button>

        <Link
          to={`/profile/${teacher._id}`}
          className="flex-1 text-center border text-sm py-1.5 rounded hover:bg-gray-100"
        >
          View
        </Link>
      </div>
    </div>
  );
};
