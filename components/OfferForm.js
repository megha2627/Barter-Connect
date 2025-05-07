import { useState, useEffect } from "react";
import axios from "axios";

export default function OfferForm({ skill }) {
  const [skillOfferedId, setSkillOfferedId] = useState("");
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    const fetchUserSkills = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/skills?userId=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserSkills(res.data);
      } catch (error) {
        console.error("Failed to fetch user skills:", error);
      }
    };
    fetchUserSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/offers`,
        {
          sender_id: 1, // Replace with actual user ID from auth in production
          receiver_id: skill.user_id,
          skill_offered_id: skillOfferedId,
          skill_requested_id: skill.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Offer sent!");
    } catch (error) {
      alert(
        "Failed to send offer: " +
          (error.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <select
        value={skillOfferedId}
        onChange={(e) => setSkillOfferedId(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">Select a skill to offer</option>
        {userSkills.map((userSkill) => (
          <option key={userSkill.id} value={userSkill.id}>
            {userSkill.title}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="ml-2 bg-green-500 text-white p-2 rounded"
      >
        Send Offer
      </button>
    </form>
  );
}
