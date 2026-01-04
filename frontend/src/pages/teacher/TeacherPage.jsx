import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserById } from '../../api/authApi';
import { ArrowLeft } from "lucide-react";

export const TeacherPage = () => {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const load = async () => {
            const data = await getUserById(id);
            setTeacher(data)
        };
        load();
    }, [id]);


    if (!teacher) {
        return (
            <div className="text-center text-gray-500 py-10">
                Profile not found
            </div>
        );
    }
    console.log(teacher)

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center gap-2 text-md bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={teacher.profilePic || "/default-avatar.png"}
                        alt={teacher.name}
                        className="w-28 h-28 rounded-full object-cover border"
                    />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {teacher.name}
                    </h1>

                    <p className="text-sm text-gray-500 capitalize mt-1">
                        {teacher.role} • {teacher.subject}
                    </p>

                    <div className="flex gap-6 mt-4 text-sm text-gray-600">
                        <span>
                            <strong>{teacher.experience}</strong> yrs experience
                        </span>
                        <span>
                            <strong>{teacher.followers?.length || 0}</strong> followers
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-3">
                        <button className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
                            Follow
                        </button>
                        <button className="px-5 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100">
                            Message
                        </button>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Detail label="Email" value={teacher.email} />
                    <Detail label="Phone" value={teacher.phone} />
                    <Detail label="Qualification" value={teacher.qualification} />
                    <Detail label="Subject" value={teacher.subject} />
                    <Detail label="Address" value={teacher.address} />
                    <Detail
                        label="Date of Birth"
                        value={teacher.dob ? new Date(teacher.dob).toDateString() : ""}
                    />
                </div>
            </div>
        </div>
    );
};

const Detail = ({ label, value }) => (
    <div>
        <p className="text-gray-400">{label}</p>
        <p className="text-gray-800">
            {value && value !== "" ? value : "—"}
        </p>
    </div>
);