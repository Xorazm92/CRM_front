import React from "react";
import "./Home.css";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import Raws from "../../components/Raws/Raws";
import StudentTable from "../../components/StudentTable/StudentTable";
import Payment from "../../components/Payment/Payment";
import Filter from "../../components/Filter/Filter";
import Pagination from "../../components/Pagination/Pagination";

function Home() {
  return (
    <div className="home-wrapper">
      {/* <PaymentModal /> */}
      {/* <Raws /> */}
      {/* <StudentTable /> */}
      {/* <Payment /> */}
      {/* <Filter /> */}
      <Pagination />
    </div>
  );
}

export default Home;
