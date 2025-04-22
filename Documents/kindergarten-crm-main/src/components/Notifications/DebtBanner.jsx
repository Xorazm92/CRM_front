import React, { useEffect, useState } from "react";

const DebtBanner = ({ studentId }) => {
  const [hasDebt, setHasDebt] = useState(false);

  useEffect(() => {
    fetch("/api/v1/payments/debtors")
      .then(res => res.json())
      .then(data => {
        setHasDebt(Array.isArray(data) && data.some(d => d.student_id === studentId));
      });
  }, [studentId]);

  if (!hasDebt) return null;
  return (
    <div className="banner warning">
      Sizda qarzdorlik mavjud!
    </div>
  );
};

export default DebtBanner;
