import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import MatchCard from "../components/MatchCard";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bio, setBio] = useState("");
  const [newSkill, setNewSkill] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
        setBio(res.data.bio || "");
        socket.emit("join", res.data.id);
        fetchSkills(res.data.id);
        fetchMatches(res.data.id);
      } catch (error) {
        window.location.href = "/login";
      }
    };

    fetchUser();

    socket.on("notification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    return () => socket.off("notification");
  }, []);

  const fetchSkills = async (userId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/skills?userId=${userId}`
      );
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  const fetchMatches = async (userId) => {
    try {
      const res = await axios.get(`/api/matches?userId=${userId}`);
      setMatches(res.data);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    try {
      await axios.post(
        "/api/skills",
        { userId: user.id, ...newSkill },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSkills(user.id);
      fetchMatches(user.id); // Refresh matches after adding a skill
      setNewSkill({ title: "", description: "", category: "" });
    } catch (error) {
      alert(
        "Failed to add skill: " +
          (error.response?.data?.error || "Unknown error")
      );
    }
  };

  const handleUpdateBio = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Bio updated");
    } catch (error) {
      alert(
        "Failed to update bio: " +
          (error.response?.data?.error || "Unknown error")
      );
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">{user.name}'s Profile</h1>
        <div className="mt-4">
          <label className="block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleUpdateBio}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Update Bio
          </button>
        </div>
        <h2 className="mt-4 text-xl font-bold">Your Skills</h2>
        <form onSubmit={handleAddSkill} className="mt-4">
          <input
            type="text"
            value={newSkill.title}
            onChange={(e) =>
              setNewSkill({ ...newSkill, title: e.target.value })
            }
            placeholder="Skill Title"
            className="p-2 border rounded mr-2"
          />
          <input
            type="text"
            value={newSkill.description}
            onChange={(e) =>
              setNewSkill({ ...newSkill, description: e.target.value })
            }
            placeholder="Description"
            className="p-2 border rounded mr-2"
          />
          <select
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="Design">Design</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Handyman">Handyman</option>
          </select>
          <button
            type="submit"
            className="ml-2 bg-green-500 text-white p-2 rounded"
          >
            Add Skill
          </button>
        </form>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 border rounded">
              <h3 className="font-bold">{skill.title}</h3>
              <p>{skill.description}</p>
              <p>Category: {skill.category}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-4 text-xl font-bold">Skill Matches</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
        <h2 className="mt-4 text-xl font-bold">Notifications</h2>
        <ul className="mt-2">
          {notifications.map((notif, index) => (
            <li key={index} className="p-2 border-b">
              {notif.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
