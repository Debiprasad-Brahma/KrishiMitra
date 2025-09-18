import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {useNavigate} from "react-router-dom"
import {User, Phone, Globe, Edit2, Save, LogOut, History, Camera, Hash} from "lucide-react"
import {useTranslation} from "react-i18next"
import ApiService from "../services/api"
import "./Profile.css"

export default function Profile() {
  const navigate = useNavigate()
  const {t, i18n} = useTranslation()

  const [user, setUser] = useState({})
  const [isEditing, setIsEditing] = useState(false) 
  const [editForm, setEditForm] = useState({
    name: "",
    language: "english",
    profileImage: null,
  })
  const [queryHistory, setQueryHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    loadProfile()
    loadQueryHistory()
  }, [])

  // Generate farmer ID from phone number and creation date
  const generateFarmerID = (phone, createdAt) => {
    const date = new Date(createdAt)
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const phoneLastFour = phone ? phone.slice(-4) : "0000"
    return `FM${year}${month}${phoneLastFour}`
  }

  const loadProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      setUser(userData)
      setEditForm({
        name: userData.name || "",
        language: userData.language || "english",
        profileImage: userData.profileImage || null,
      })

      if (userData.profileImage) {
        setImagePreview(userData.profileImage)
      }
    } catch (err) {
      console.error("Failed to load profile:", err)
    }
  }

  const loadQueryHistory = async () => {
    try {
      const response = await ApiService.getQueryHistory()
      if (response.success) {
        setQueryHistory(response.queries || [])
      }
    } catch (err) {
      console.error("Failed to load query history:", err)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert(t("profile.invalidImageType") || "Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert(t("profile.imageTooLarge") || "Image size should be less than 5MB")
      return
    }

    setUploadingImage(true)

    try {
      // Create FormData for image upload
      const formData = new FormData()
      formData.append("profileImage", file)

      // Upload image to server
      const response = await ApiService.uploadProfileImage(formData)

      if (response.success) {
        const imageUrl = response.imageUrl
        setEditForm((prev) => ({...prev, profileImage: imageUrl}))
        setImagePreview(imageUrl)
      }
    } catch (err) {
      console.error("Failed to upload image:", err)
      alert(t("profile.imageUploadFailed") || "Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

const handleSave = async () => {
  setLoading(true)
  try {
    // Update profile via API
    const response = await ApiService.updateProfile(editForm)

    if (response.success) {
      const updatedUser = { ...user, ...editForm }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      localStorage.setItem("lang", editForm.language)

      // Change app language
      i18n.changeLanguage(editForm.language)

      setUser(updatedUser)
      setIsEditing(false)

      alert(t("profile.updateSuccess") || "Profile updated successfully!")

      // ✅ Redirect based on language
      if (editForm.language === "malayalam") {
        navigate("/malayalam-dashboard")
      } else if (editForm.language === "hindi") {
        navigate("/hindi-dashboard")
      } else if (editForm.language === "odia") {
        navigate("/odia-dashboard")
      } else {
        navigate("/dashboard") // default English
      }
    }
  } catch (err) {
    console.error("Failed to update profile:", err)
    alert(t("profile.updateFailed") || "Failed to update profile")
  } finally {
    setLoading(false)
  }
}


  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("lang")
    navigate("/login")
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language === "ml" ? "ml-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const farmerID = generateFarmerID(user.phone, user.createdAt)

  // Animation variants
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const tabVariants = {
    hidden: {opacity: 0, x: -20},
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const fieldVariants = {
    hidden: {opacity: 0, x: -15},
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const historyItemVariants = {
    hidden: {opacity: 0, scale: 0.95},
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <motion.div
      className="profile-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="profile-container">
        <motion.div
          className="profile-header"
          variants={itemVariants}
        >
          <motion.div
            className="profile-avatar"
            whileHover={{scale: 1.05}}
            transition={{duration: 0.3}}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <User size={48} />
            )}
            {isEditing && (
              <motion.label
                htmlFor="imageInput"
                className="image-upload-overlay"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
              >
                <Camera size={20} />
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{display: "none"}}
                  disabled={uploadingImage}
                />
              </motion.label>
            )}
            {uploadingImage && (
              <motion.div
                className="upload-spinner"
                animate={{rotate: 360}}
                transition={{duration: 1, repeat: Infinity, ease: "linear"}}
              >
                ⏳
              </motion.div>
            )}
          </motion.div>
          <motion.h2 variants={itemVariants}>{t("profile.title") || "Farmer Profile"}</motion.h2>
          <motion.p
            className="farmer-id"
            variants={itemVariants}
            whileHover={{scale: 1.02}}
          >
            ID: {farmerID}
          </motion.p>
        </motion.div>

        <motion.div
          className="profile-tabs"
          variants={itemVariants}
        >
          <motion.button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            variants={tabVariants}
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
          >
            {t("profile.profileTab") || "Profile"}
          </motion.button>
          <motion.button
            className={`tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
            variants={tabVariants}
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
          >
            {t("profile.historyTab") || "Query History"}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              className="profile-content"
              key="profile"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.5}}
            >
              <div className="profile-card">
                <motion.div
                  className="profile-field"
                  custom={0}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="field-icon">
                    <Hash size={20} />
                  </div>
                  <div className="field-content">
                    <label>{t("profile.farmerID") || "Farmer ID"}</label>
                    <span>{farmerID}</span>
                  </div>
                </motion.div>

                <motion.div
                  className="profile-field"
                  custom={1}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="field-icon">
                    <User size={20} />
                  </div>
                  <div className="field-content">
                    <label>{t("profile.name") || "Name"}</label>
                    {isEditing ? (
                      <motion.input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder={t("profile.enterName") || "Enter your name"}
                        whileFocus={{scale: 1.02}}
                        transition={{duration: 0.2}}
                      />
                    ) : (
                      <span>{user.name || t("profile.notSet") || "Not set"}</span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="profile-field"
                  custom={2}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="field-icon">
                    <Phone size={20} />
                  </div>
                  <div className="field-content">
                    <label>{t("profile.phone") || "Phone Number"}</label>
                    <span>{user.phone}</span>
                  </div>
                </motion.div>

                <motion.div
                  className="profile-field"
                  custom={3}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="field-icon">
                    <Globe size={20} />
                  </div>
                  <div className="field-content">
                    <label>{t("profile.language") || "Language"}</label>
                    {isEditing ? (
                      <motion.select
                        value={editForm.language}
                        onChange={(e) => setEditForm({...editForm, language: e.target.value})}
                        whileFocus={{scale: 1.02}}
                        transition={{duration: 0.2}}
                      >
                        <option value="english">{t("languages.english") || "English"}</option>
                        <option value="malayalam">{t("languages.malayalam") || "Malayalam"}</option>
                        <option value="hindi">{t("languages.hindi") || "Hindi"}</option>
                        <option value="tamil">{t("languages.tamil") || "Tamil"}</option>
                        <option value="odia">{t("languages.odia") || "Odia"}</option>
                      </motion.select>
                    ) : (
                      <span className="capitalize">
                        {t(`languages.${user.language}`) || user.language || "english"}
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="profile-actions"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.6, duration: 0.5}}
                >
                  {isEditing ? (
                    <>
                      <motion.button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={loading}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                      >
                        <Save size={16} />
                        {loading
                          ? t("profile.saving") || "Saving..."
                          : t("profile.saveChanges") || "Save Changes"}
                      </motion.button>
                      <motion.button
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                      >
                        {t("profile.cancel") || "Cancel"}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                    >
                      <Edit2 size={16} />
                      {t("profile.editProfile") || "Edit Profile"}
                    </motion.button>
                  )}
                </motion.div>
              </div>

              <motion.div
                className="profile-stats"
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.7, duration: 0.5}}
              >
                <motion.div
                  className="stat-item"
                  whileHover={{scale: 1.05}}
                  transition={{duration: 0.2}}
                >
                  <div className="stat-number">{queryHistory.length}</div>
                  <div className="stat-label">{t("profile.totalQueries") || "Total Queries"}</div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  whileHover={{scale: 1.05}}
                  transition={{duration: 0.2}}
                >
                  <div className="stat-number">
                    {user.createdAt
                      ? new Date(user.createdAt).getFullYear()
                      : new Date().getFullYear()}
                  </div>
                  <div className="stat-label">{t("profile.memberSince") || "Member Since"}</div>
                </motion.div>
              </motion.div>

              <motion.button
                className="btn btn-logout"
                onClick={handleLogout}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.8, duration: 0.5}}
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
              >
                <LogOut size={16} />
                {t("profile.logout") || "Logout"}
              </motion.button>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              className="history-content"
              key="history"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.5}}
            >
              <motion.h3
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5}}
              >
                <History size={20} />
                {t("profile.queryHistory") || "Query History"}
              </motion.h3>
              {queryHistory.length === 0 ? (
                <motion.div
                  className="empty-state"
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{duration: 0.5}}
                >
                  <p>
                    {t("profile.noQueries") ||
                      "No queries yet. Start asking questions to see your history!"}
                  </p>
                </motion.div>
              ) : (
                <div className="history-list">
                  <AnimatePresence>
                    {queryHistory.map((query, index) => (
                      <motion.div
                        key={query._id || index}
                        className="history-item"
                        custom={index}
                        variants={historyItemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{scale: 1.01, y: -2}}
                        transition={{duration: 0.2}}
                      >
                        <div className="query-text">
                          <strong>{t("profile.question") || "Q"}:</strong> {query.question}
                        </div>
                        {query.imageUrls && query.imageUrls.length > 0 && (
                          <div className="query-images">
                            {query.imageUrls.map((imageUrl, idx) => (
                              <motion.img
                                key={idx}
                                src={imageUrl}
                                alt={`Query image ${idx + 1}`}
                                className="query-image"
                                whileHover={{scale: 1.1}}
                                transition={{duration: 0.2}}
                              />
                            ))}
                          </div>
                        )}
                        <div className="query-answer">
                          <strong>{t("profile.answer") || "A"}:</strong> {query.answer}
                        </div>
                        <div className="query-meta">
                          <span className="query-date">{formatDate(query.createdAt)}</span>
                          <span className="query-language">
                            {t(`languages.${query.language}`) || query.language}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
