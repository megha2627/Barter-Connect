import { useState } from "react";
import OfferForm from "./OfferForm";

export default function SkillCard({ skill }) {
  const [showOfferForm, setShowOfferForm] = useState(false);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold">{skill.title}</h3>
      <p>{skill.description}</p>
      <p>Category: {skill.category}</p>
      <p>Offered by: {skill.user_name}</p>
      <button
        onClick={() => setShowOfferForm(!showOfferForm)}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Propose Barter
      </button>
      {showOfferForm && <OfferForm skill={skill} />}
    </div>
  );
}
