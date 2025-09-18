import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import "../../assets/css/bookmark/style.css";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import BookMarkSkeleton from "./BookmarkSkeleton";
import { API_ENDPOINTS } from "../../ulits/apiConstant";
import { useSelector } from "react-redux";
import HTMLReactParser from "html-react-parser";
import { Tooltip } from "antd";

const Bookmarks = () => {
  const user_id = sessionStorage.getItem("id");
  const [qbListData, setQbListData] = useState([]);
  const [arrowToggle, setArrowToggle] = useState(null);
  const [mybookmarkList, setMybookmarkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { courseId } = useSelector((state) => state.testseries);

  const [questionList, setQuestionList] = useState([]);
  const [DropdownId, setdrpDownId] = useState(null);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axiosInstance.post(
          API_ENDPOINTS.BOOKMARK.GET_BOOKMARKED_QBANK_SUBJECT,
          { user_id: user_id, level_flag: "2", qbank_course_id: courseId }
        );
        setLoading(false);
        const data = response?.data?.data || [];
        setQbListData(data);
      } catch (err) {
        console.log(err);
        setQbListData([]); // Set empty array on error
      }
    };
    getdata();
  }, []);

  const handleSectionClick = (index) => {
    setArrowToggle(arrowToggle === index ? null : index);
    if (arrowToggle !== index) {
      getCalledToggle(index);
    }
  };

  const handleQbank = async (id) => {
    setdrpDownId(DropdownId == id ? null : id);
    const response = await axiosInstance.post(
      API_ENDPOINTS.BOOKMARK.BOOKMARK_CATEGORY_LIST,
      {
        user_id: user_id,
        qbank_id: id,
      }
    );
    if (response?.data?.status == true) {
      setQuestionList(response?.data?.data);
    }
  };

  const getCalledToggle = (id) => {
    try {
      const qbanksdata = qbListData.filter((item) => item.topic_id === id);
      setMybookmarkList(qbanksdata[0]?.qbanks);
    } catch (err) {
      console.log(err);
      setMybookmarkList([]);
    }
  };

  const ResultView = (sid) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

      // Open the new window

      window.open(
        `/testresult/dqbank/${user_id}d${DropdownId}`,
        "_blank",
        features
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleQueSelect = async (id) => {
    // console.log(id);
    ResultView(id);
  };

  //Custom parser option for image
  const parserOptions = {
    replace: (domNode) => {
      // Handle <p> that contains an image
      if (domNode.name === "p" && domNode.children) {
        const imgNode = domNode.children.find((child) => child.name === "img");

        if (imgNode) {
          const src = imgNode.attribs.src;

          // Extract text inside <p> but ignore the <img>
          const textOnly = domNode.children
            .filter((child) => child.type === "text")
            .map((child) => child.data)
            .join(" ");

          return (
            <Tooltip
              placement="right"
              title={
                <img src={src} alt="No Preview" style={{ width: "200px" }} />
              }
            >
              <p style={{ cursor: "pointer", display: "inline-block" }}>
                {textOnly || "Hover to view image"}
              </p>
            </Tooltip>
          );
        }
      }
    },
  };

  return (
    <div className="DqbBookmarkData">
      <div className="container">
        <ul className="list-inline">
          <li>
            <a href="/">Home </a> Book Mark
          </li>
        </ul>
        {loading ? (
          <BookMarkSkeleton />
        ) : qbListData.length === 0 ? (
          <div className="no-bookmark">
            <h3>No Bookmark Available </h3>
          </div>
        ) : (
          <div>
            {qbListData.map((itm, i) => (
              <div
                key={i}
                className="tab-content1"
                style={{ position: "relative" }}
              >
                <div className="tab-pane fade show active">
                  <div id="post_list">
                    <div className="widget curriculum-emez">
                      <div className="widget-post-bx">
                        <div
                          className="setofDiv"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSectionClick(itm.topic_id)}
                        >
                          <div className="widget-post clearfix">
                            <div className="listbox_bookmark text-center"></div>
                            <div className="ttr-post-info">
                              <div className="ttr-post-header flex-grow-1">
                                <span className="arrowSet">
                                  {arrowToggle === itm.topic_id ? (
                                    <FaAngleDown size={20} />
                                  ) : (
                                    <FaAngleRight size={20} />
                                  )}
                                </span>
                                <h6 className="post-title">
                                  <a className="feeddetails">
                                    {itm.topic_name}{" "}
                                    <span>{itm.total} Questions</span>
                                  </a>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        {arrowToggle === itm.topic_id && (
                          <div className="questionBoxSet">
                            {mybookmarkList.length === 0 ? (
                              <p>No bookmarks in this category</p>
                            ) : (
                              <div>
                                {mybookmarkList.map((it, i) => (
                                  <div key={i}>
                                    <div
                                      className="d-flex align-items-center justify-content-between border rounded shadow-sm p-3 mb-3"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleQbank(it.qbank_id)}
                                    >
                                      <div className="d-flex align-items-center">
                                        <img
                                          src={it.qbank_image || ""}
                                          alt=""
                                          onError={(e) =>
                                            (e.target.src = "/logo.png")
                                          }
                                          className="rounded-circle me-3"
                                          style={{
                                            height: "50px",
                                            width: "50px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <span className="fw-semibold">
                                          {it.qbankname}
                                        </span>
                                      </div>
                                      {it.length}
                                      {DropdownId == it.qbank_id ? (
                                        <FaAngleDown
                                          size={20}
                                          className="text-muted"
                                        />
                                      ) : (
                                        <FaAngleRight
                                          size={20}
                                          className="text-muted"
                                        />
                                      )}
                                    </div>
                                    {DropdownId === it.qbank_id && (
                                      <div className="card shadow-sm my-3 border-0 rounded-3">
                                        <div className="card-body">
                                          <ol className="list-group list-group-numbered list-group-flush">
                                            {questionList.map((item) => (
                                              <li
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                  handleQueSelect(item.id)
                                                }
                                                key={item.id}
                                                className="list-group-item py-3 px-2 d-flex align-items-start"
                                              >
                                                <div className="w-100">
                                                  {HTMLReactParser(
                                                    item.question,
                                                    parserOptions
                                                  )}
                                                </div>
                                              </li>
                                            ))}
                                          </ol>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
