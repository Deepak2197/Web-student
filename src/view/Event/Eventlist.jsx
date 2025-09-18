import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axiosInstance from "../../API/axiosConfig";
import { Skeleton } from "antd";
import { API_ENDPOINTS } from "../../ulits/apiConstant";
import "../../assets/css/event/style.css";
import "../../assets/css/event/responsive.css";
import "../../assets/new_design/css/footer.css";

Modal.setAppElement("#root");

const Eventlist = () => {
  const navigate = useNavigate();
  const [catlist, setCatlist] = useState([]);
  const [eventlistdata, setEventlistdata] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [spin, setSpin] = useState(false);
  const user_id = sessionStorage.getItem("id");
  const city_id = null;
  const cat_id = null;
  const event_name = null;
  useEffect(() => {
    const fetchEvents = async () => {
      setSpin(true);
      try {
        const response = await axiosInstance.post(
          API_ENDPOINTS.EVENT.GET_ALL_EVENTS,
          {
            user_id: user_id,
            city_id: city_id,
            cat_id: cat_id,
            stage_type: 1,
            event_name: event_name,
          }
        );
        const data = response?.data?.data;
        setCatlist(data?.cat_wise_event_list || []);
        setAllEvents(data?.cat_wise_event_list || []);
        setEventlistdata(data?.cat_wise_event_list[0]?.event_list || []);
        setActiveCategory(data?.cat_wise_event_list[0]?.id || 0); // Default to first category
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setSpin(false);
      }
    };
    fetchEvents();
  }, []);

  // Handle category click to filter events
  const handleCategoryClick = (categoryId, categoryName) => {
    setActiveCategory(categoryId);
    const selectedCategory = allEvents.find((cat) => cat.id === categoryId);
    setEventlistdata(selectedCategory?.event_list || []);
  };

  // Handle search filtering within the active category
  useEffect(() => {
    if (searchTerm) {
      const filteredData = eventlistdata.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEventlistdata(filteredData);
    } else {
      // Reset to the active category's events when search is cleared
      const activeCat = allEvents.find((cat) => cat.id === activeCategory);
      setEventlistdata(activeCat?.event_list || allEvents[0]?.event_list || []);
    }
  }, [searchTerm, allEvents, activeCategory]);

  // Search input handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Navigation handlers
  const handleBookOnline = (eventId) => {
    localStorage.setItem("eventId", eventId);
    navigate("/eventcenter");
  };

  const handleEvent = (eventId) => {
    localStorage.setItem("eventId", eventId);
    navigate("/Eventbooking");
  };

  const handleViewDetails = (eventId) => {
    navigate("/event-ticket", { state: { eventId } });
  };

  return (
    <div className="EventList">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>Events</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="event_module">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="upcom_event">
                {/* Search Bar */}
                <div className="row position-relative">
                  <div className="col-12 position-relative">
                    <div className="search_btng">
                      <input
                        type="text"
                        className="form-control"
                        id="search"
                        placeholder="Search all events"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <i className="fa fa-search"></i>
                    </div>
                  </div>
                </div>

                {/* Event Categories and List */}
                <Skeleton active loading={spin} paragraph={{ rows: 4 }}>
                  <div className="row">
                    {/* Category Tabs */}
                    <div className="col-12 col-lg-12">
                      <ul className="nav nav-pills" id="event">
                        {catlist.map((eventcat) => (
                          <li className="nav-item" key={eventcat.id}>
                            <Link
                              className={`nav-link ${
                                activeCategory === eventcat.id ? "active" : ""
                              }`}
                              data-toggle="pill"
                              href="#dvt"
                              onClick={() =>
                                handleCategoryClick(eventcat.id, eventcat.name)
                              }
                            >
                              {eventcat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Event List */}
                    <div className="col-12 col-lg-12">
                      <div id="eventListAjax">
                        <div className="tab-content" id="add-event">
                          <div id="dvt" className="tab-pane active">
                            <div className="dvt_sec">
                              <div className="row">
                                {eventlistdata.length > 0 ? (
                                  eventlistdata.map((event) => (
                                    <div
                                      className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 sec_pd"
                                      key={event.id}
                                    >
                                      <div className="event_prt">
                                        {/* Event Image */}
                                        <Link to="#">
                                          <div className="img_sec position-relative">
                                            <img
                                              src={
                                                event.cover_image ||
                                                `${window.IMG_BASE_URL}/dams-icon/logo.png`
                                              }
                                              alt={event.title}
                                              onError={(e) =>
                                                (e.target.src = `${window.IMG_BASE_URL}/dams-icon/logo.png`)
                                              }
                                            />
                                            <div className="online">
                                              <p>
                                                {parseInt(
                                                  event.availability_course
                                                ) === 1 && <h6>Online</h6>}
                                                {parseInt(
                                                  event.availability_course
                                                ) === 2 && (
                                                  <h6 className="face-text">
                                                    Face to Face
                                                  </h6>
                                                )}
                                                {parseInt(
                                                  event.availability_course
                                                ) === 3 && (
                                                  <h6 className="blue-text">
                                                    Online | Face to Face
                                                  </h6>
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </Link>

                                        {/* Event Details */}
                                        <div className="text_sec">
                                          <Link to="#">
                                            <div className="row m-0">
                                              <div className="col-12 p-0">
                                                <div className="SetofDiv">
                                                  <div className="matter">
                                                    <h5>{event.title}</h5>
                                                    <h6>
                                                      {event.event_start_date},{" "}
                                                      {event.event_vanue},{" "}
                                                      {event.event_start_time}
                                                    </h6>
                                                  </div>
                                                  <div className="event-type">
                                                    <h5>
                                                      <span className="text-set">
                                                        {event.mrp == 0 ? (
                                                          <span>Free</span>
                                                        ) : (
                                                          `₹${event.mrp}`
                                                        )}
                                                      </span>
                                                    </h5>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </Link>

                                          {/* Booking Buttons */}
                                          <div className="row m-0">
                                            <div className="col-12 col-md-12 p-0">
                                              <div className="on-btn">
                                                {(() => {
                                                  if (event.is_purchased == 1) {
                                                    return (
                                                      <button
                                                        className="btn btn-booked"
                                                        disabled
                                                      >
                                                        Booked
                                                      </button>
                                                    );
                                                  } else if (
                                                    parseInt(
                                                      event.availability_course,
                                                      10
                                                    ) === 3
                                                  ) {
                                                    return (
                                                      <div>
                                                        <button
                                                          className="btn btn-online"
                                                          onClick={() =>
                                                            handleEvent(
                                                              event.id
                                                            )
                                                          }
                                                        >
                                                          Book Online
                                                        </button>
                                                        <button
                                                          className="btn btn-face2face"
                                                          onClick={() =>
                                                            handleBookOnline(
                                                              event.id
                                                            )
                                                          }
                                                        >
                                                          Book Face to Face
                                                        </button>
                                                      </div>
                                                    );
                                                  } else if (
                                                    parseInt(
                                                      event.availability_course,
                                                      10
                                                    ) === 1 &&
                                                    parseInt(
                                                      event.is_cbt,
                                                      10
                                                    ) === 1
                                                  ) {
                                                    return (
                                                      <button
                                                        className="btn btn-cbt"
                                                        onClick={() =>
                                                          handleEvent(event.id)
                                                        }
                                                      >
                                                        CBT
                                                      </button>
                                                    );
                                                  } else if (
                                                    parseInt(
                                                      event.availability_course,
                                                      10
                                                    ) === 2
                                                  ) {
                                                    return (
                                                      <button
                                                        className="btn btn-face2face"
                                                        onClick={() =>
                                                          handleBookOnline(
                                                            event.id
                                                          )
                                                        }
                                                      >
                                                        Book Face to Face
                                                      </button>
                                                    );
                                                  } else {
                                                    return (
                                                      <button
                                                        className="btn btn-online"
                                                        onClick={() =>
                                                          handleEvent(event.id)
                                                        }
                                                      >
                                                        Book Online
                                                      </button>
                                                    );
                                                  }
                                                })()}
                                              </div>

                                              {/* View Details Button */}
                                              {event.is_purchased === "1" &&
                                                event.availability_course ===
                                                  "2" && (
                                                  <div className="on-btn">
                                                    <button
                                                      className="btn btn-details"
                                                      onClick={() =>
                                                        handleViewDetails(
                                                          event.id
                                                        )
                                                      }
                                                    >
                                                      View Details
                                                    </button>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="col-12">
                                    <p>No events found for this category.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Eventlist;
