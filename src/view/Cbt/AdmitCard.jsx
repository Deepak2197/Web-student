import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import { Spinner } from "react-bootstrap";
import { API_ENDPOINTS } from "../../ulits/apiConstant";

const AdmitCard = () => {
  const navigate = useNavigate();
  const user_id = sessionStorage.getItem("id");
  const test_id = JSON.parse(localStorage.getItem("test_id"));
  const [admitCard, setAdmitCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const resdata = sessionStorage.getItem("userData");
  const userDataObj = JSON.parse(resdata);

  useEffect(() => {
    const getAdmitCard = async () => {
      try {
        const res = await axiosInstance.post(
          API_ENDPOINTS.CBT.GET_ADMIT_CARD_DATA,
          { test_id: test_id, user_id: user_id }
        );
        if (res?.data?.status === true) {
          setAdmitCard(res?.data?.data);
          localStorage.setItem(
            "fetchAdmitcard",
            JSON.stringify(res?.data?.data)
          );
        }
      } catch (error) {
        console.error("Failed to fetch admit card:", error);
        setAdmitCard(null);
      } finally {
        setLoading(false);
      }
    };

    getAdmitCard();
  }, [test_id, user_id]);

  const handleAdmitCard = () => {
    navigate("/admit-card-detail");
  };

  let admitCardContent;

  if (loading) {
    admitCardContent = (
      <div style={{ width: "100%", textAlign: "center" }}>
        <Spinner size="lg" />
      </div>
    );
  } else if (admitCard) {
    admitCardContent = (
      <>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">
            <div className="cardDetail text-center">
              <h3>{admitCard?.TEST_NAME}</h3>
              <img
                src={
                  userDataObj?.cbt_profilePic
                    ? userDataObj?.cbt_profilePic
                    : ""
                }
                loading="lazy" alt="User profile"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{userDataObj?.name}</td>
                </tr>
                <tr>
                  <td>CBT Id:</td>
                  <td>{admitCard?.TEST_ID}</td>
                </tr>
                <tr>
                  <td>Student Id:</td>
                  <td>{admitCard?.STUDENT_ID}</td>
                </tr>
                <tr>
                  <td>Exam Time:</td>
                  <td>{admitCard?.START_TIME}</td>
                </tr>
                <tr>
                  <td>Exam Date:</td>
                  <td>{admitCard?.START_DATE}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="ProceedNow text-center">
          {admitCard?.admitcardurl === "Awaiting Admit Card" ? (
            <button type="button">Awaiting Admit Card</button>
          ) : (
            <button type="button" onClick={handleAdmitCard}>
              Proceed Now
            </button>
          )}
        </div>
      </>
    );
  } else {
    admitCardContent = <h2>Admit card will generate soon.</h2>;
  }

  return (
    <div className="admitcard">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>CBT Admit Card</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="AdmitCard">
        <div className="container">
          {admitCardContent}
        </div>
      </section>
    </div>
  );
};

export default AdmitCard;
