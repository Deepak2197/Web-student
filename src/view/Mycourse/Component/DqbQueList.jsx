import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../API/axiosConfig";
import "../style.css";
import "../../../components/DailyQuiz/TestPanel.css";
import { API_ENDPOINTS } from "../../../ulits/apiConstant";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa";

const DqbQueList = () => {
  const { id } = useParams();
  const user_id = id.split("d")[0];
  const test_segment_id = id.split("d")[1];

  const [sol, setsol] = useState(null);
  const [questions, setque] = useState([]);
  const [chosenOptions, setchos] = useState(null);
  const [testid, settestid] = useState(null);

  useEffect(() => {
    const getResult = async () => {
      const response1 = await axiosInstance.post(
        API_ENDPOINTS.BOOKMARK.BOOKMARK_LIST_FANWALL,
        {
          user_id: user_id,
          test_series_id: test_segment_id,
          type: "QUIZ",
        }
      );

      setsol(response1?.data?.data);
      setque(response1?.data?.data);
    };

    getResult();
  }, []);

  const handleRemoveBookmark = async (id) => {
    setque((prev) => prev.filter((item) => item.id !== id));
    const res = await axiosInstance.post(
      API_ENDPOINTS.BOOKMARK.REMOVE_FANWAL_BOOKMARK,
      {
        q_type: "",
        user_id: user_id,
        question_id: id,
      }
    );

    if (res.data.status == true) {
      toast.success("Remove From Bookmark");
    } else {
      toast.error("Failed Removes");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <section className="solutionTab">
        <div className="">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="questionHead">
                <h2>{sol?.basic_info?.test_series_name}</h2>
                <h3> Question Wise Report</h3>
              </div>

              {questions?.map((data, index) => (
                <div className="questionBox">
                  <h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <b>Question:</b> {index + 1}
                      </div>
                      <FaBookmark
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveBookmark(data.id)}
                      />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: data.question }} />
                  </h4>
                  <div className="questionMid">
                    <div className="list-group">
                      <a
                        href="javascriptvoid:(0)"
                        className="list-group-item list-group-item-action"
                        style={{
                          backgroundColor:
                            data.choosed_option == 1
                              ? "skyblue"
                              : data.answer == 1
                              ? "#90EE90"
                              : "white",
                        }}
                      >
                        <span className="qsnNumbr">A</span>
                        {data.option_1}
                      </a>
                      <a
                        href="javascriptvoid:(0)"
                        className="list-group-item list-group-item-action"
                        style={{
                          backgroundColor:
                            data.choosed_option == 2
                              ? "skyblue"
                              : data.answer == 2
                              ? "#90EE90"
                              : "white",
                        }}
                      >
                        <span className="qsnNumbr">B</span>
                        {data.option_2}
                      </a>
                      <a
                        href="javascriptvoid:(0)"
                        className={`list-group-item list-group-item-action`}
                        style={{
                          backgroundColor:
                            data.choosed_option == 3
                              ? "skyblue"
                              : data.answer == 3
                              ? "#90EE90"
                              : "white",
                        }}
                      >
                        <span className="qsnNumbr rigthqsn">C</span>
                        {data.option_3}
                      </a>
                      <a
                        href="javascriptvoid:(0)"
                        className="list-group-item list-group-item-action"
                        style={{
                          backgroundColor:
                            data.choosed_option == 4
                              ? "skyblue"
                              : data.answer == 4
                              ? "#90EE90"
                              : "white",
                        }}
                      >
                        <span className="qsnNumbr">D</span>
                        {data.option_4}
                      </a>
                    </div>
                    <h5></h5>
                    <h6>
                      <span className="fontExp">Explanation:</span>

                      <div
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      />
                    </h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DqbQueList;
