import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  deleteUser, 
  fetchprofile, 
  updateUser, 
  getUserById 
} from "../api/authApi";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  BookOpen, Award, Briefcase, GraduationCap,
  Building, BookMarked, ArrowLeft, Camera,
  Save, Edit, Trash2, Loader, MessageCircle, UserPlus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null); // Store the actual file

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    profilePic: "", // Keep this as URL for display
    subject: "",
    phone: "",
    dob: "",
    address: "",
    qualification: "",
    experience: "",
    course: "",
    branch: "",
    semester: "",
  });

  // Check if this is the current user's profile
  useEffect(() => {
    if (authUser && profileUser) {
      const currentUserId = authUser.id || authUser._id;
      const profileUserId = profileUser._id || profileUser.id;
      setIsCurrentUser(currentUserId === profileUserId);
    }
  }, [authUser, profileUser, id]);

  // Fetch profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        let userData;
        
        if (id) {
          userData = await getUserById(id);
          setProfileUser(userData);
        } else {
          const res = await fetchprofile();
          userData = res.user || res;
          setProfileUser(userData);
          setIsCurrentUser(true);
        }

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "",
          profilePic: userData.profilePic || "/default-avatar.png",
          subject: userData.subject || "",
          phone: userData.phone || "",
          dob: userData.dob ? userData.dob.split("T")[0] : "",
          address: userData.address || "",
          qualification: userData.qualification || "",
          experience: userData.experience || "",
          course: userData.course || "",
          branch: userData.branch || "",
          semester: userData.semester || "",
        });
        
        // Clear any previous image file
        setProfileImageFile(null);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    
    // Store the actual file
    setProfileImageFile(file);
    
    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, profilePic: previewUrl }));
    
    setUploadingImage(false);
    toast.success("Image selected! Click Save to upload.");
  };

// Save profile changes
const saveProfile = async () => {
  try {

    // Create FormData
    const formData = new FormData();
    
    // Add only the necessary fields, NOT the old profilePic
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('role', form.role);
    
    // Optional fields - only add if they have value
    if (form.phone) formData.append('phone', form.phone);
    if (form.dob) formData.append('dob', form.dob);
    if (form.address) formData.append('address', form.address);
    
    // Role-specific fields
    if (form.role === 'teacher') {
      formData.append('subject', form.subject);
      if (form.qualification) formData.append('qualification', form.qualification);
      if (form.experience) formData.append('experience', form.experience);
    } else if (form.role === 'student') {
      if (form.course) formData.append('course', form.course);
      if (form.branch) formData.append('branch', form.branch);
      if (form.semester) formData.append('semester', form.semester);
    }
    
    // CRITICAL: Add profile image file only if new file is selected
    if (profileImageFile) {
      formData.append('profilePic', profileImageFile);
    }else{
       formData.append('profilePic', formData.profilePic);
    }


    await updateUser(formData);
    toast.success("Profile updated successfully!");
    setEdit(false);
    
    // Refresh profile data
    const res = await fetchprofile();
    const userData = res.user || res;
    setProfileUser(userData);
    setForm(prev => ({
      ...prev,
      ...userData,
      profilePic: userData.profilePic || "/default-avatar.png"
    }));
    
    // Clear the stored file after successful upload
    setProfileImageFile(null);
    
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
    console.error("Update error:", error);
  }
};

  // Cancel edit mode
  const cancelEdit = () => {
    setEdit(false);
    
    // Reset form to original values from profileUser
    if (profileUser) {
      setForm(prev => ({
        ...prev,
        name: profileUser.name || "",
        email: profileUser.email || "",
        profilePic: profileUser.profilePic || "/default-avatar.png",
        subject: profileUser.subject || "",
        phone: profileUser.phone || "",
        dob: profileUser.dob ? profileUser.dob.split("T")[0] : "",
        address: profileUser.address || "",
        qualification: profileUser.qualification || "",
        experience: profileUser.experience || "",
        course: profileUser.course || "",
        branch: profileUser.branch || "",
        semester: profileUser.semester || "",
      }));
    }
    
    // Clear any uploaded image file
    setProfileImageFile(null);
    
    // Revoke the blob URL to free memory
    if (form.profilePic && form.profilePic.startsWith('blob:')) {
      URL.revokeObjectURL(form.profilePic);
    }
  };

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (form.profilePic && form.profilePic.startsWith('blob:')) {
        URL.revokeObjectURL(form.profilePic);
      }
    };
  }, [form.profilePic]);

  // Delete account
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteUser();
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          {!isCurrentUser && (
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <UserPlus className="w-4 h-4" />
                Follow
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            {/* Banner */}
            <div className={`h-32 ${form.role === 'teacher' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'}`}></div>
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100">
                  <img
                    src={form.profilePic}
                    alt={form.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                
                {/* Edit Image Button */}
                {isCurrentUser && edit && (
                  <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
                
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Loader className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
                
                {/* Image changed indicator */}
                {profileImageFile && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 md:px-8 pb-8">
            {/* Name and Role */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {edit && isCurrentUser ? (
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="border-b-2 border-blue-500 focus:outline-none bg-transparent px-2 py-1 rounded"
                          placeholder="Enter your name"
                        />
                      ) : (
                        form.name
                      )}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        form.role === 'teacher' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {form.role?.toUpperCase()}
                      </span>
                      {form.role === 'teacher' && form.subject && (
                        <span className="text-gray-600 text-sm">• {form.subject}</span>
                      )}
                    </div>
                  </div>
                  
                  {!isCurrentUser && profileUser && (
                    <div className="flex gap-6 mt-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{profileUser.experience || 0}</span>
                        <span>{form.role === 'teacher' ? 'Years Exp.' : 'Semester'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{profileUser.followers?.length || 0}</span>
                        <span>Followers</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{profileUser.following?.length || 0}</span>
                        <span>Following</span>
                      </div>
                    </div>
                  )}
                </div>

                {isCurrentUser && (
                  <div className="flex gap-3">
                    {!edit ? (
                      <button
                        onClick={() => setEdit(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveProfile}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DetailField
                icon={<User className="w-5 h-5 text-gray-500" />}
                label="Full Name"
                value={form.name}
                edit={edit && isCurrentUser}
                onChange={(value) => setForm({ ...form, name: value })}
                type="text"
              />

              <DetailField
                icon={<Mail className="w-5 h-5 text-gray-500" />}
                label="Email"
                value={form.email}
                readOnly
              />

              <DetailField
                icon={<Phone className="w-5 h-5 text-gray-500" />}
                label="Phone"
                value={form.phone}
                edit={edit && isCurrentUser}
                onChange={(value) => setForm({ ...form, phone: value })}
                type="tel"
                placeholder="Enter phone number"
              />

              <DetailField
                icon={<Calendar className="w-5 h-5 text-gray-500" />}
                label="Date of Birth"
                value={edit && isCurrentUser ? form.dob : formatDate(form.dob)}
                edit={edit && isCurrentUser}
                onChange={(value) => setForm({ ...form, dob: value })}
                type={edit && isCurrentUser ? "date" : "text"}
              />

              <DetailField
                icon={<MapPin className="w-5 h-5 text-gray-500" />}
                label="Address"
                value={form.address}
                edit={edit && isCurrentUser}
                onChange={(value) => setForm({ ...form, address: value })}
                type="textarea"
                placeholder="Enter your address"
                className="md:col-span-2"
              />

              {form.role === 'teacher' ? (
                <>
                  <DetailField
                    icon={<BookOpen className="w-5 h-5 text-gray-500" />}
                    label="Subject"
                    value={form.subject}
                    edit={edit && isCurrentUser}
                    onChange={(value) => setForm({ ...form, subject: value })}
                    type="text"
                    placeholder="Mathematics, English..."
                  />

                  <DetailField
                    icon={<Award className="w-5 h-5 text-gray-500" />}
                    label="Qualification"
                    value={form.qualification}
                    edit={edit && isCurrentUser}
                    onChange={(value) => setForm({ ...form, qualification: value })}
                    type="text"
                    placeholder="B.Ed, M.Sc..."
                  />

                  <DetailField
                    icon={<Briefcase className="w-5 h-5 text-gray-500" />}
                    label="Experience (Years)"
                    value={form.experience}
                    edit={edit && isCurrentUser}
                    onChange={(value) => setForm({ ...form, experience: value })}
                    type="number"
                    placeholder="3"
                  />
                </>
              ) : form.role === 'student' ? (
                <>
                  <DetailField
                    icon={<GraduationCap className="w-5 h-5 text-gray-500" />}
                    label="Course"
                    value={form.course}
                    edit={edit && isCurrentUser}
                    onChange={(value) => setForm({ ...form, course: value })}
                    type="text"
                    placeholder="BCA, BSc, etc."
                  />

                  <DetailField
                    icon={<Building className="w-5 h-5 text-gray-500" />}
                    label="Branch"
                    value={form.branch}
                    edit={edit && isCurrentUser}
                    onChange={(value) => setForm({ ...form, branch: value })}
                    type="text"
                    placeholder="Computer Science"
                  />

                  <DetailField
                    icon={<BookMarked className="w-5 h-5 text-gray-500" />}
                    label="Semester/Year"
                    value={form.semester}
                    edit={edit && isCurrentUser}
                    onChange={(value) => setForm({ ...form, semester: value })}
                    type="text"
                    placeholder="4th Sem / 2nd Year"
                  />
                </>
              ) : null}
            </div>

            {isCurrentUser && (
              <div className="border-t pt-6 mt-6">
                <button
                  onClick={deleteAccount}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Warning: This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ 
  icon, 
  label, 
  value, 
  edit = false, 
  onChange, 
  type = "text", 
  placeholder = "", 
  readOnly = false,
  className = ""
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      {edit && !readOnly ? (
        type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={placeholder}
            rows="3"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={placeholder}
            readOnly={readOnly}
          />
        )
      ) : (
        <p className={`px-3 py-2.5 rounded-lg bg-gray-50 ${value ? "text-gray-900" : "text-gray-400 italic"}`}>
          {value || "Not provided"}
        </p>
      )}
    </div>
  );
}