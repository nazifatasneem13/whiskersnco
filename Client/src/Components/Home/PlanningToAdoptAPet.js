import React from "react";
import Card from "./Card";

const PlanningToAdoptAPet = () => {
  return (
    <div className="planning-container">
      <h1>Thinking About Adopting a Pet?</h1>
      <div className="boxes-container">
        <Card
          title="The Joy of Welcoming a Pet"
          description="Introducing a pet into your life enriches it in unique ways, offering joy and unconditional love. Adopting a pet means giving them a forever home and experiencing the special bond that forms when you care for an animal."
        />
        <Card
          title="Your Pet Adoption Journey"
          description="Ready to expand your family with a pet? Adopting is a heartwarming decision with significant considerations. This journey requires understanding, patience, and commitment, but it results in a rewarding relationship that lasts a lifetime."
        />
        <Card
          title="Healing Benefits of Pets"
          description="Pets bring more than just joy; they provide remarkable health benefits. Their presence can lessen stress, improve heart health, and elevate our overall happiness. The connection with a pet is not only enjoyable but also healing."
        />
      </div>
    </div>
  );
};

export default PlanningToAdoptAPet;
