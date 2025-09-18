import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../API/axiosConfig";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../ulits/apiConstant";
import "../../../assets/css/event/style.css";
import "../../../assets/css/event/responsive.css";
import "../../../assets/new_design/css/footer.css";
const Eventcenter = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, 0);

  const userid = sessionStorage.getItem("id");
  const [eventCenterData, setEventCenterData] = useState([]);
  const [spin, setspin] = useState(false);
  useEffect(() => {
    const eventId = localStorage.getItem("eventId");

    if (eventId) {
      setspin(true);
      axiosInstance
        .post(API_ENDPOINTS.EVENT.GET_EVENT_WIZE_CENTER, {
          user_id: userid,
          event_id: eventId,
        })
        .then((response) => {
          if (response.data.status === true) {
            setEventCenterData(response.data.data);
            setspin(false);
          } else {
            toast.error(response.data.message);
            navigate(-1);

            setspin(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  useEffect(() => {}, [eventCenterData]);

  return (
    <>
      <div className="page-content">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>List Center</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="list-center">
        {spin ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <Spinner style={{ height: "100px", width: "100px" }} />
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <p>Showing Event In India</p>
              </div>
              <input
                type="hidden"
                id="eventdefaultid"
                name="center"
                value="1076"
              />
              <input type="hidden" id="subdefaultid" name="subid" value="32" />
              {eventCenterData.map((course) => (
                <div
                  className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4"
                  key={course.id}
                >
                  <div className="show-event active">
                    <ul>
                      <li>
                        <img
                          src={`${window.IMG_BASE_URL}/dams-icon/logo.png`}
                          alt="DAMS Logo"
                        />
                      </li>
                      <li>
                        {course.event_vanue}
                        <span className="text-block">{course.address}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="next-btn getsubid">
                  <Link to="/Eventbooking">Next</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
export default Eventcenter;
