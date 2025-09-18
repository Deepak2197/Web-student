import { Button, Radio } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import "../../assets/css/bookmark/style.css";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../ulits/apiConstant";
import { Modal } from "react-bootstrap";
import { FaShare } from "react-icons/fa";

const CreateTest = () => {
  // State definitions
  const [noque, setNoque] = useState(10); // Number of questions
  const [questionSource, setQuestionSource] = useState("1"); // Question source (level)
  const [step, setStep] = useState(1); // Current step (1, 2, or 3)
  const [allselected, setAllselected] = useState(true); // "All Subjects" or "Choose Subject" mode
  const [alllevel, setAlllevel] = useState([]); // Question bank levels
  const [allsub, setAllsub] = useState([]); // Subjects and their topics
  const [visibleSubjectId, setVisibleSubjectId] = useState(null); // Subject ID for visible topics
  const [selectedIds, setSelectedIds] = useState(""); // Selected subject IDs for "All Subjects"
  const [topicIds, setTopicIds] = useState(""); // Selected topic IDs for "All Subjects"
  const [myselectid, setMyselectid] = useState(""); // Selected subject IDs for "Choose Subject"
  const [myselectid1, setMyselectid1] = useState(""); // Selected topic IDs for "Choose Subject"
  const [mode, setMode] = useState(1); // Test mode (1 for Exam, 2 for Guide)

  const [modal, setModal] = useState(false);
  const [moduleData, setModuleData] = useState({});

  const navigate = useNavigate();
  const course_id = "385"; // Hardcoded course ID
  const user_id = sessionStorage.getItem("id"); // User ID from session storage

  // Fetch question bank levels
  useEffect(() => {
    const getQbankLevel = async () => {
      try {
        const res = await axiosInstance.post(
          API_ENDPOINTS.CUSTOM_QBANK.CUSTOM_QBANK_LEVEL,
          { user_id }
        );
        setAlllevel(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching qbank level:", error);
        alert("Failed to fetch question levels. Please try again.");
      }
    };

    if (user_id) {
      getQbankLevel();
    }
  }, [user_id]);

  // Fetch subjects and topics when entering step 2
  useEffect(() => {
    if (step === 2) {
      getSubjects();
    }
  }, [step, questionSource]);

  // Fetch subjects and topics
  const getSubjects = async () => {
    try {
      const res = await axiosInstance.post(
        API_ENDPOINTS.CUSTOM_QBANK.CUSTOM_QBANK_SUBJECT,
        {
          user_id,
          qbank_course_id: course_id,
          level_flag: questionSource,
        }
      );
      const subjects = res?.data?.data || [];
      setAllsub(subjects);

      // Set default selections for "All Subjects" mode
      if (allselected && subjects.length > 0) {
        const allSubjectIds = subjects
          .map((subject) => subject.subject_id)
          .filter((id) => id)
          .join(",");
        const allTopicIds = subjects
          .flatMap((subject) => subject.topics?.map((topic) => topic.id) || [])
          .filter((id) => id)
          .join(",");
        setSelectedIds(allSubjectIds);
        setTopicIds(allTopicIds);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      alert("Failed to fetch subjects. Please try again.");
    }
  };

  // Handle mode switch between "All Subjects" and "Choose Subject"
  useEffect(() => {
    if (allselected && allsub.length > 0) {
      // Select all subjects and topics in "All Subjects" mode
      const allSubjectIds = allsub
        .map((subject) => subject.topicid)
        .filter((id) => id)
        .join(",");
      const allTopicIds = allsub
        .flatMap((subject) => subject.topics?.map((topic) => topic.id) || [])
        .filter((id) => id)
        .join(",");
      setSelectedIds(allSubjectIds);
      setTopicIds(allTopicIds);
      setMyselectid(""); // Clear "Choose Subject" selections
      setMyselectid1("");
    } else {
      // Clear all selections when switching to "Choose Subject" mode
      setSelectedIds("");
      setTopicIds("");
      setMyselectid("");
      setMyselectid1("");
    }
  }, [allselected, allsub]);

  // Handle subject selection in "All Subjects" mode
  const handleCheckboxChange = (subjectId) => {
    if (allselected) {
      const subjectIdsArray = selectedIds
        ? selectedIds.split(",").filter((id) => id)
        : [];
      const topicIdsArray = topicIds
        ? topicIds.split(",").filter((id) => id)
        : [];
      if (subjectIdsArray.find((id) => id == subjectId)) {
        // Deselect subject and its topics

        const newSubjectIds = subjectIdsArray.filter((id) => id !== subjectId);

        const subject = allsub.find((s) => s.subject_id === subjectId);
        const topicIdsToRemove =
          subject?.topics?.map((topic) => String(topic.id)) || [];
        const newTopicIds = topicIdsArray.filter(
          (id) => !topicIdsToRemove.includes(id)
        );

        setSelectedIds(newSubjectIds.join(","));
        setTopicIds(newTopicIds.join(","));
      } else {
        // Select subject and its topics
        const newSubjectIds = [...subjectIdsArray, String(subjectId)];
        const subject = allsub.find((s) => s.topicid === subjectId);
        const topicIdsToAdd =
          subject?.topics?.map((topic) => String(topic.id)) || [];
        const newTopicIds = [...topicIdsArray, ...topicIdsToAdd].filter(
          (id, index, self) => self.indexOf(id) === index
        );

        setSelectedIds(newSubjectIds.join(","));
        setTopicIds(newTopicIds.join(","));
      }
    }
  };

  // Handle subject selection in "Choose Subject" mode (auto-select all topics)
  const handleCheckboxChange1 = (subjectId) => {
    if (!allselected) {
      const subjectIdsArray = myselectid
        ? myselectid.split(",").filter((id) => id)
        : [];

      const topicIdsArray = myselectid1
        ? myselectid1.split(",").filter((id) => id)
        : [];

      let newSubjectIds = [...subjectIdsArray];
      let newTopicIds = [...topicIdsArray];

      if (subjectIdsArray.includes(String(subjectId))) {
        // Deselect subject and its topics
        newSubjectIds = subjectIdsArray.filter(
          (id) => id !== String(subjectId)
        );
        const subject = allsub.find((s) => s.topicid === subjectId);
        const topicIdsToRemove =
          subject?.topics?.map((topic) => String(topic.id)) || [];
        newTopicIds = topicIdsArray.filter(
          (id) => !topicIdsToRemove.includes(id)
        );
      } else {
        // Select subject and auto-select all its topics
        newSubjectIds = [...subjectIdsArray, String(subjectId)];
        const subject = allsub.find((s) => s.topicid === subjectId);
        const topicIdsToAdd =
          subject?.topics?.map((topic) => String(topic.id)) || [];
        newTopicIds = [...topicIdsArray, ...topicIdsToAdd].filter(
          (id, index, self) => self.indexOf(id) === index
        );
      }

      setMyselectid(newSubjectIds.join(","));
      setMyselectid1(newTopicIds.join(","));
    }
  };

  // Handle topic selection in "Choose Subject" mode
  const handleCheckboxChange2 = (topicId) => {
    if (!allselected) {
      const topicIdsArray = myselectid1
        ? myselectid1.split(",").filter((id) => id)
        : [];

      if (topicIdsArray.includes(String(topicId))) {
        // Deselect topic
        const newTopicIds = topicIdsArray.filter(
          (id) => id !== String(topicId)
        );
        setMyselectid1(newTopicIds.join(","));
      } else {
        // Select topic
        const newTopicIds = [...topicIdsArray, String(topicId)];
        setMyselectid1(newTopicIds.join(","));
      }
    }
  };

  // Toggle topic visibility for a subject
  const handleSeeTopics = (subjectId) => {
    setVisibleSubjectId((prev) => (prev === subjectId ? null : subjectId));
  };

  // Create test and navigate to test page
  const handleCreate = async () => {
    try {
      const payload = {
        user_id,
        no_of_ques: noque,
        ques_from: questionSource,
        subject: allselected ? selectedIds : myselectid,
        topics: allselected ? topicIds : myselectid1,
        mode,
        tags: "",
        qbank_course_id: course_id
      };

      const res = await axiosInstance.post(API_ENDPOINTS.CUSTOM_QBANK.CUSTOM_QBANK_FOR_TEST, payload);
      if (res?.data?.data?.id) {
        setModal(true);
        setModuleData(res?.data?.data)
      } else {
        alert("Test creation failed: No test ID returned.");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      alert("Error creating test. Please try again.");
    }
  };

  const handleChallenge = () => {
    navigate(`/topic-share/${moduleData?.id}`);
  };

  const handleStartTest =  (mode, test_series_id) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;
      if (mode == 1) {
        window.open(
          `/exam-mode/${user_id}t${test_series_id}`,
          "_blank",
          features
        );
      } else {
        window.open(
          `/reg-mode/${user_id}t${test_series_id}`,
          "_blank",
          features
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = () => {
    navigate(`/topic-share/${moduleData?.id}`);
  };


  function convertTimestampToDate(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000); // convert seconds → ms
    return date.toLocaleString("en-IN", {
      weekday: "long", // e.g., Tuesday
      year: "numeric", // e.g., 2025
      month: "long", // e.g., August
      day: "numeric", // e.g., 26
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className="customQBank">
      <div className="container">
        <div className="qbankInnerNew">
          {step === 1 && (
            <div className="qBankOptionPart">
              <div className="qsnNumber" style={{ display: "flex", alignItems: "center",justifyContent: "space-between" }} >
                <div style={{ display: "flex", alignItems: "center" }} >
                <h4 style={{ marginRight: "10px" }} >Number of Questions</h4>
                <select onChange={(e) => setNoque(Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                </div>
              </div>
            

              <div className="setdiffiLevel">
                <div className="difLevel">
                  <div className="difImgSet">
                    <img
                      src={`${window.IMG_BASE_URL}/emdpublic/qbank/question.svg`}
                      alt="Question"
                    />
                  </div>
                  <h2>Choose Question From</h2>
                </div>
                <div className="inputSection inputSectionNew">
                  {alllevel.map((item) => (
                    <p key={item.id}>
                      <input
                        type="radio"
                        id={`qbank-${item.id}`}
                        name="question-group"
                        checked={questionSource === item.id}
                        onChange={() => setQuestionSource(item.id)}
                      />
                      <label htmlFor={`qbank-${item.id}`}>
                        <span>{item.title}</span>
                      </label>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="groupbtndata setdiffiLevel">
              <div className="btndataset inputSection inputSectionNew1">
                <p>
                  <Radio
                    id="all-subjects"
                    name="subject-selection"
                    checked={allselected}
                    onChange={() => setAllselected(true)}
                  >
                    All Subjects
                  </Radio>
                </p>
                <p>
                  <Radio
                    id="choose-subject"
                    name="subject-selection"
                    checked={!allselected}
                    onChange={() => setAllselected(false)}
                  >
                    Choose Subject
                  </Radio>
                </p>
              </div>

              <div className="allSelectedData">
                {allsub?.map((subject) => (
                  <div className="allSubMap" key={subject.topicid}>
                    <div className="allSubInner">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={
                          allselected
                            ? selectedIds
                                .split(",")
                                .includes(String(subject.topicid))
                            : myselectid
                                .split(",")
                                .includes(String(subject.topicid))
                        }
                        onChange={() =>
                          allselected
                            ? handleCheckboxChange(subject.topicid)
                            : handleCheckboxChange1(subject.topicid)
                        }
                      />
                      <span className="selectName">{subject.topic_name}</span>
                      <button
                        className="btndefinedata"
                        onClick={() => handleSeeTopics(subject.topicid)}
                      >
                        {visibleSubjectId === subject.topicid
                          ? "Hide Topics"
                          : "See Topics"}
                      </button>
                    </div>

                    {visibleSubjectId === subject.topicid &&
                      subject.topics?.length > 0 && (
                        <div className="leftData">
                          {subject.topics.map((topic) => (
                            <div className="allSubInner" key={topic.id}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={
                                  allselected
                                    ? topicIds
                                        .split(",")
                                        .includes(String(topic.id))
                                    : myselectid1
                                        .split(",")
                                        .includes(String(topic.id))
                                }
                                onChange={() => handleCheckboxChange2(topic.id)}
                                disabled={allselected}
                              />
                              <span
                                style={{ color: "#424242" }}
                                className="selectName"
                              >
                                {topic.topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="chooseLevel selectMode groupbtndata setdiffiLevel setdiffiLevel1">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="difLevel">
                      <h2>Choose Your Preferences</h2>
                    </div>
                  </div>
                  <div className="SetBoxBgMode">
                    <div className="col-md-12">
                      <div className="headmain">
                        <h2>Select Mode:</h2>
                      </div>
                    </div>
                    <div className="ModeSetBox inputSection inputSectionNew2">
                      <div className="modeDiv" onClick={() => setMode(1)}>
                        <div className="modeOption">
                          <p>
                            <input
                              type="radio"
                              id="exam-mode"
                              name="mode-selection"
                              checked={mode === 1}
                              onChange={() => setMode(1)}
                            />
                            <label htmlFor="exam-mode">
                              <span>
                                <div className="SetCirleOfMode">
                                  <div className="modeimg">
                                    <img
                                      src={`${window.IMG_BASE_URL}/custom_qbank/exam.svg`}
                                      alt="Exam Mode"
                                    />
                                  </div>
                                  <div className="modetext">
                                    <h3>Exam Mode</h3>
                                    <p>
                                      Solutions and References will be visible
                                      after completion of the QBank.
                                    </p>
                                  </div>
                                </div>
                              </span>
                            </label>
                          </p>
                        </div>
                      </div>
                      <div className="modeDiv" onClick={() => setMode(2)}>
                        <div className="modeOption">
                          <p>
                            <input
                              type="radio"
                              id="guide-mode"
                              name="mode-selection"
                              checked={mode === 2}
                              onChange={() => setMode(2)}
                            />
                            <label htmlFor="guide-mode">
                              <span>
                                <div className="SetCirleOfMode">
                                  <div className="modeimg">
                                    <img
                                      src={`${window.IMG_BASE_URL}/custom_qbank/guide.svg`}
                                      alt="Guide Mode"
                                    />
                                  </div>
                                  <div className="modetext">
                                    <h3>Guide Mode</h3>
                                    <p>
                                      Solutions and References will be visible
                                      while the question is being attempted.
                                    </p>
                                  </div>
                                </div>
                              </span>
                            </label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bottomNext">
            {step !== 1 && (
              <Button
                style={{ backgroundColor: "#007aff", color: "white" }}
                onClick={() => setStep((prev) => prev - 1)}
              >
                Prev
              </Button>
            )}
            {step < 3 ? (
              <Button
                style={{ backgroundColor: "#007aff", color: "white" }}
                onClick={() => setStep((prev) => prev + 1)}
                disabled={
                  step === 2 &&
                  ((allselected && !selectedIds) ||
                    (!allselected && !myselectid))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                style={{ backgroundColor: "#007aff", color: "white" }}
                onClick={handleCreate}
                disabled={
                  (allselected && !selectedIds) || (!allselected && !myselectid)
                }
              >
                Create Test
              </Button>
            )}
          </div>
        </div>
      </div>
      {modal && (
        <Modal
          className="allQBankmodalPopup"
          show={modal}
          onHide={() => {
            setModal(false);
          }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="bodySec">
              <div className="imgPart">
                <img src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/custom_qbank/crteate.svg" />
              </div>
              <div className="TextPart">
                <h3>QBank From All QBank</h3>
                <p>
                  Created at : {convertTimestampToDate(moduleData.creation)}{" "}
                </p>
              </div>
            </div>
            <div className="bottomSec">
              <p>
                Subject : <span>{moduleData.subjects} Subject Select</span>
              </p>
              {/* <p>Difficulty Level : {moduleData.mode} </p> */}
              <p>
                Mode : <span>{moduleData.mode ? "Guide Mode" : "Exam Mode"}</span>
              </p>
              <img src={`${window.IMG_BASE_URL}/dams-icon/qsn-bank.png`}/>
              <h3>Question Bank</h3>
              <h4>{moduleData.no_of_question} Questions </h4>
              {/* <button className="btnShare" onClick={handleShare} >
                <FaShare/>
                Share
              </button> */}
            </div>
            <div className="butnGroup">
              <button onClick={handleChallenge} className="challenge">Challenge</button>
              <button onClick={()=>handleStartTest(mode, moduleData.id)} >Start Now</button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default CreateTest;
