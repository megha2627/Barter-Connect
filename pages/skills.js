import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import SkillCard from "../components/SkillCard";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`/api/skills?category=${category}`);
        setSkills(res.data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };
    fetchSkills();
  }, [category]);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Skills</h1>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Design">Design</option>
          <option value="Tutoring">Tutoring</option>
          <option value="Handyman">Handyman</option>
        </select>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}
