import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import { Link, useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../../ulits/apiConstant";
const TopicShare = () => {
  const user_id = sessionStorage.getItem("id");
  const { id } = useParams();
  const [testdata, settestdata] = useState(null);
  const [searchterm, setsearch] = useState(null);
  const [users, setusers] = useState([]);
  const [clicked, setClicked] = useState({});
  const gettestdata = async () => {
    const response = await axiosInstance.post(
      `/v2_data_model/get_test_series_with_id_app_new`,
      { user_id: user_id, test_id: id }
    );
    settestdata(response?.data?.data?.basic_info);
  };
  const getusers = async (searchttext) => {
    const response = await axiosInstance.post(
      `/v2_data_model/get_active_user`,
      { user_id: user_id, test_id: id, searchkey: searchttext, course_id: 385 }
    );
    setusers(response?.data?.data);
  };
  useEffect(() => {
    gettestdata();
  }, []);

  useEffect(() => {
    getusers(searchterm);
  }, [searchterm]);

  const handlechallenge = async (gid) => {
    const res = await axiosInstance.post(
      API_ENDPOINTS.CUSTOM_QBANK.INVITE_CUSTOM_QBANK,
      {
        test_id: id,
        invited_by: user_id,
        invited_to: gid,
      }
    );

    getusers(searchterm);
  };

  const handleClick = (data) => {
    if (data?.invited === 0) {
      handlechallenge(data?.id);
      setClicked((prev) => ({ ...prev, [data?.id]: true }));
    }
  };

  return (
    <div className="topicShare">
      <div className="container">
        <div className="joinCustomQbank">
          <div className="row">
            <div className="col-md-12">
              <div className="liveChallenge">
                <div className="startingSoon">
                  {/* <p>Live Challenge Starting Soon<span className='time'>15m 41s</span></p> */}
                  <Link to={"/attemped-history"}>
                    <button className="btn custonBtn">Join Custom QBank</button>
                  </Link>
                </div>
                <div
                  className="fulllBox"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div className="topicBox">
                    <div className="imgPart">
                      <img
                        src={`${window.IMG_BASE_URL}/custom_qbank/anatomy.svg`}
                      />
                    </div>
                    <div className="textPart">
                      <p>Topic</p>
                      <h3>{testdata?.test_series_name}</h3>
                    </div>
                  </div>
                  <div className="topicBox">
                    <div className="imgPartNew">
                      <img
                        src={`${window.IMG_BASE_URL}/custom_qbank/question.svg`}
                      />
                    </div>
                    <div className="textPart">
                      <p>Total questions</p>
                      <h3>{testdata?.total_questions}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="searchSec position-relative">
                <div className="form-group has-search">
                  <span className="fa fa-search form-control-feedback"></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    onChange={(e) => setsearch(e.target.value)}
                  />
                </div>
                <div className="cList">
                  <img src={`${window.IMG_BASE_URL}/custom_qbank/clist.svg`} />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="Players">
                <h4>Available Player</h4>
              </div>
            </div>
            <div className="col-md-12">
              <div className="playerScroll">
                {users
                  ?.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
                  .map((data) => (
                    <div className="availabelPlayer" key={data?.id}>
                      <p>
                        <img
                          className="profile"
                          src={
                            data?.profile_picture === ""
                              ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&s`
                              : data?.profile_picture
                          }
                        />
                        {data?.name}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                       
                        {clicked[data?.id] && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: "#08D002",
                              color: "#fff",
                              fontSize: "12px",
                            }}
                          >
                            ✓
                          </span>
                        )}

                        <button
                          className="btn challengeBtn"
                          style={{
                            backgroundColor: clicked[data?.id]
                              ? "#08D0020D"
                              : "#EEEEEE",
                            border: clicked[data?.id]
                              ? "2px solid #08D002"
                              : "2px solid #EEEEEE",
                            color: clicked[data?.id] ? "#08D002" : "#757575",
                            fontWeight: clicked[data?.id] ? "600" : "normal",
                            borderRadius: "8px",
                            padding: "4px 12px",
                          }}
                          onClick={() => handleClick(data)}
                        >
                          {clicked[data?.id] ? "Invited" : "Challenge"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopicShare;
