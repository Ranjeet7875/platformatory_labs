import React, { useEffect, useState } from "react";
import { User, Phone, MapPin, Mail, Edit3, LogOut, Save, Check, AlertCircle } from "lucide-react";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    pincode: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/profile", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          city: data.city || "",
          pincode: data.pincode || ""
        });
      })
      .catch(() => (window.location.href = "/"));
  }, []);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      // Update local user state with saved data
      setUser(prev => ({
        ...prev,
        ...formData
      }));

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      city: user.city || "",
      pincode: user.pincode || ""
    });
    setIsEditing(false);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        credentials: "include"
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const getInitials = () => {
    if (!formData.firstName && !formData.lastName) return "U";
    return `${formData.firstName?.charAt(0) || ""}${formData.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getWelcomeName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    } else if (formData.firstName) {
      return formData.firstName;
    } else if (formData.lastName) {
      return formData.lastName;
    }
    return "User";
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header Section */}
        <div className="profile-header-card">
          <div className="profile-header">
            <div className="profile-header-overlay"></div>
            <div className="profile-header-content">
              <div className="profile-avatar">
                {getInitials()}
              </div>
              <div className="profile-welcome">
                <h1 className="profile-welcome-title">
                  Welcome back, {getWelcomeName()}! 👋
                </h1>
                <p className="profile-welcome-subtitle">
                  Manage your profile information and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form-card">
          <div className="profile-form-header">
            <div className="profile-form-title">
              <User size={24} />
              <h2>Profile Information</h2>
            </div>
            <div className="profile-form-actions">
              {saveSuccess && (
                <div className="success-message">
                  <Check size={16} />
                  <span>Saved successfully!</span>
                </div>
              )}
              <button
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                className={`edit-btn ${isEditing ? 'edit-btn-cancel' : 'edit-btn-primary'}`}
              >
                <Edit3 size={16} />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="profile-form-content">
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'form-input-disabled' : ''}`}
                    placeholder="Enter your first name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'form-input-disabled' : ''}`}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper input-with-icon">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`form-input form-input-with-icon ${!isEditing ? 'form-input-disabled' : ''}`}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">City</label>
                <div className="input-wrapper input-with-icon">
                  <MapPin className="input-icon" size={18} />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`form-input form-input-with-icon ${!isEditing ? 'form-input-disabled' : ''}`}
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div className="form-group form-group-full">
                <label className="form-label">Pincode</label>
                <div className="input-wrapper pincode-wrapper">
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`form-input ${!isEditing ? 'form-input-disabled' : ''}`}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="form-actions">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="save-btn"
                >
                  {isSaving ? (
                    <>
                      <div className="save-spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logout Section */}
        <div className="logout-section">
          <div className="logout-content">
            <div className="logout-info">
              <h3 className="logout-title">Account Actions</h3>
              <p className="logout-subtitle">Manage your account settings</p>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;