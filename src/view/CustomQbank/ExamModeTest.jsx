import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBookmark, FaCircle, FaRegBookmark, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { Button, ModalBody, Spinner } from "react-bootstrap";
import { ModalHeader } from "reactstrap";
import axiosInstance from "../../API/axiosConfig";
import "../../components/Test_Series/Testpanel.css"
import { notification, Modal as AntModal} from "antd"; 
import { FaCircleCheck } from "react-icons/fa6";


const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "20%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FAFAFA",
    marginTop: "8%",
  },
};
const customStyles2 = {
  content: {
    top: "70%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    height:'500px',
    width:'600px',
    transform: "translate(-50%, -20%)",
  },
};


Modal.setAppElement("#root");

const ExamModeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user_id = id.split("t")[0];
  const test_series_id = id.split("t")[1];
  const [testData, setTestData] = useState(null);
  const [tab, setTab] = useState(1);
  const [totaltime, settotaltime] = useState(0);

  const [timeLeft, setTimeLeft] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  const [disableNav, setDisableNav] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [allmarked, setallmarked] = useState([]);

  const [quesArray, setQuesArray] = useState([]);
  const [Attempted,setattempted] = useState(null);
  const [UnAttempted,setunatempted] = useState(null);
  const [marked,setmarked] = useState(null);
  const [LastView,setLastView] = useState(null);
  const [disableSubmit,setDisSub] = useState(false);
  
  const [modalIsOpen1, setIsOpen1] = React.useState(false);
  const [resultload,setresultload]= useState(true);

   const [successMessage, setSuccessMessage] = useState("");
   const [starValue, setStarValue]= useState(0);


   const handleStarClick = (rate) => {
    setStarValue(rate);
  };

  const fetchdata = async () => {
    try {
      const response = await axiosInstance.post(
        `/v2_data_model/get_test_series_with_id_app_new`,
        { user_id: user_id, test_id: test_series_id }
      );
      // console.log(response?.data?.data?.question_bank?.length)
      setTestData(response?.data?.data);
      // console.log(response?.data?.data);
     
      settotaltime(Number(response?.data?.data?.question_bank?.length));
      setTimeLeft(Number(response?.data?.data?.question_bank?.length) * 60);
      const questionsArray = Object.values(
        response?.data?.data?.question_bank || {}
      ).map((question) => question.question);
      setQuesArray(questionsArray);




    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    const preventInspect = (event) => {
      if ((event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
          (event.ctrlKey && event.keyCode === 73)) { // Ctrl+I
        event.preventDefault();
      }
    };

    window.addEventListener('contextmenu', preventContextMenu);
    window.addEventListener('keydown', preventInspect);

    return () => {
      window.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventInspect);
    };
  }, []);
  
  useEffect(() => {
    fetchdata();

   
   
  }, []);

  const [userSelections, setUserSelections] = useState([]);

  const handleNext = () => {
    if (tab < testData?.question_bank.length) {
      setTab((prevTab) => prevTab + 1);
    }
  };

  const handlePrev = () => {
    if (tab > 1) {
      setTab((prevTab) => prevTab - 1);
    }
  };

  const handleOptionClick = (option, optionNo, id, correctAns) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [tab]: option,
    }));


let lastview = id;
setLastView(lastview);

    const existingIndex = userSelections.findIndex(
      (selection) => selection.id == id
    );
  
    // Prepare the new selection object
    const newSelection = {
      optionTicked: optionNo,
      id: id,
    };

    // If the question ID already exists, update the existing selection
    if (existingIndex != -1) {
      const updatedSelections = [...userSelections];
      updatedSelections[existingIndex] = newSelection;
      setUserSelections(updatedSelections);
    } else {
      // If the question ID does not exist, add the new selection to the array
      setUserSelections([...userSelections, newSelection]);
    }
  };

  const handleMark = (opt) => {
    if (!allmarked.includes(opt)) {
      allmarked.unshift(opt);
    }
    else 
    {
      const index = allmarked.indexOf(opt);
      // If value is found in the array, remove it
      if (index !== -1) {
        allmarked.splice(index, 1);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) =>
          prevTimeLeft > 0 ? prevTimeLeft - 1 : 0
        );
      }, 1000);
    }

    // console.log(timeLeft);
    if (timeLeft == 0) {
      setIsOpen1(true);
      
    }

    return () =>clearInterval(interval);
  }, [isRunning]);

  // const handleToggle = () => {
  //   setIsRunning((prevIsRunning) => !prevIsRunning);
  //   if (disableNav) {
  //     setDisableNav(false);
  //   } else {
  //     setDisableNav(true);
  //   }
  // };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const completionTime = new Date(); // replace with actual saved timestamp


  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [isSuccessModalOpen,setIsSuccessModalOpen] = useState(false);


  useEffect(() => {
    // console.log(console.log(userSelections));
  }, [userSelections]);

  const handleSubmit = async () => {
    

    setattempted(userSelections.length);
    setunatempted(testData?.question_bank.length - (userSelections.length));
    setmarked(allmarked.length);
    setIsOpen(true);

    // navigate('/testresult')
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setIsSuccessModalOpen(false);

  }


  const attemptedMap = userSelections.reduce((acc, ans) => {
    acc[ans.id] = ans;
    return acc;
}, {});

// console.log(attemptedMap);

const newArr = testData?.question_bank.map((question, index) => ({
  order: index + 1,
  question_id: question.id,
  answer: attemptedMap[question.id] ? attemptedMap[question.id].optionTicked.toString() : "",
  onscreen: 5, // Assuming default value is 5
  guess: 0, // Assuming default value is 0
  review: 0, // Assuming default value is 0
  part: "", // Assuming default value is an empty string
  section_id: 0, // Assuming default value is 0
  unanswered: attemptedMap[question.id] ? "1" : "",
  "is_correct": "0",
 
}));





  const handlefinal = async()=> {
    setresultload(false);
    setDisSub(true);
    // Create a new FormData object
    const formData = new FormData();
  
    // Append key-value pairs to the FormData object
    formData.append("user_id", user_id);
    formData.append("question_dump", JSON.stringify(newArr));
    formData.append("test_series_id", test_series_id);
    formData.append("time_spent", Number(totaltime*60-timeLeft).toFixed(0));
    formData.append("state", 0);
    formData.append("last_view", LastView);
  
    // Send a POST request with the FormData object
    const response = await axiosInstance.post(
      "/v2_data_model/save_quiz_new",
      formData
    );
  // console.log("after save",response);
    if(response.status)
    {
      setSuccessMessage(response?.message)

      toast.success("Test completed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setresultload(true);
      navigate(`/testresultcustom/${test_series_id}`);  
    }

  }

  useEffect(() => {
    const handleUnload = async (event) => {
      event.preventDefault();
      event.returnValue = ''; // Prompt the user with a confirmation dialog

      // Save test data when the user closes the window or the system shuts down
      await saveTestData();

      return ''; // Required for Chrome
    };

    const saveTestData = async () => {
      try {
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("question_dump", JSON.stringify(newArr));
        formData.append("test_series_id", test_series_id);
        formData.append("time_spent", Number(totaltime * 60 - timeLeft).toFixed(0));
        formData.append("state", 1); // Assuming '1' represents an incomplete state
        formData.append("last_view", LastView);

        // Send a POST request with the FormData object
        await axiosInstance.post("/v2_data_model/save_quiz_new", formData);
      } catch (error) {
        console.error('Error saving test data:', error);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user_id, test_series_id, totaltime, timeLeft, newArr]);

  const [modalIsOpen2, setIsOpen2] = React.useState(false);
  const [imgurl,setimgurl] = useState("");
     

const HandleImg = (e)=>{
  if(e.target.tagName=="IMG")
  {

    setimgurl(e.target.src);
    setIsOpen2(true);
  }
}
const [bookmarks, setBookmarks] = useState([]);

const handleBookmark = async (tabNumber, question_id) => {
  const bookmarked = bookmarks.includes(tabNumber); // Check if already bookmarked

  try {
    if (!bookmarked) {
      // If not already bookmarked, add bookmark
      const response = await axiosInstance.post(
        "/v2_data_model/question_bookmark",
        {
          user_id: user_id,
          question_id: question_id,
          q_type: testData?.basic_info?.set_type,
        }
      );
      setBookmarks([...bookmarks, tabNumber]);
      notification.open({
        message: (
          <span>
            <FaBookmark style={{ marginRight: "8px" }} />
            {response?.data?.message}
          </span>
        ),
        duration: 2,
        placement: "bottom",
      });
    } else {
      // If already bookmarked, remove bookmark
      const response = await axiosInstance.post(
        "/v2_data_model/remove_fanwal_bookmark",
        {
          user_id: user_id,
          question_id: question_id,
          q_type: testData?.basic_info?.set_type,
        }
      );
      setBookmarks(bookmarks.filter((bookmark) => bookmark !== tabNumber));
      notification.open({
        message: (
          <span>
            <FaBookmark style={{ marginRight: "8px" }} />
            {response?.data?.message}
          </span>
        ),
        duration: 2,
        placement: "bottom",
      });
      // console.log("Unbookmarked", response);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <>
      <div className="TestPanel">
       
        <div className="container">
          <div className="testcont">
            <div className="quecont">
              <div className="stopwatch">
               
                <div>{formatTime(timeLeft)}</div>
              </div>

              <h4 style={{ }}>
                {testData?.basic_info?.test_series_name}
              </h4>
              {testData?.question_bank?.map((que, index) => (
                <>
                  {tab === index + 1 && (
                    <>
                      <div className="groupwith">
                        <div style={{ width: "70%" }}>
                        <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <h5>Q.{index + 1}</h5>
                            {bookmarks.includes(tab) ? (
                              <FaBookmark
                                onClick={() => handleBookmark(tab, que.id)}
                              />
                            ) : (
                              <FaRegBookmark
                                onClick={() => handleBookmark(tab, que.id)}
                              />
                            )}
                          </div>
                          <div   onClick={HandleImg} title="Click to zoom!" dangerouslySetInnerHTML={{ __html: que.question }} />

                          {[
                            que.option_1,
                            que.option_2,
                            que.option_3,
                            que.option_4,
                          ].map((option, i) => (
                            <div
                              key={i + 1}
                              className="optionlist"
                              style={{
                                backgroundColor:
                                  selectedOptions[tab] === option
                                    ? "skyblue"
                                    : "white",
                              }}
                              onClick={() =>
                                handleOptionClick(
                                  option,
                                  i + 1,
                                  que.id,
                                  que.answer
                                )
                              }
                            >
                              <h5 className="optionNo">
                                {String.fromCharCode(65 + i)}
                              </h5>
                              <div dangerouslySetInnerHTML={{ __html: option }} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                    <AntModal
                        open={isSuccessModalOpen}
                        footer={null}
                        closable={false}
                        centered
                        styles={{
                          body: {
                            textAlign: "center",
                            padding: "20px",
                          },
                        }}
                        maskClosable={false}
                      >
                        <p>{successMessage}</p>
                      </AntModal>
                      <div>
                        <Modal
                          isOpen={modalIsOpen}
                          onAfterOpen={afterOpenModal}
                          onRequestClose={closeModal}
                          style={customStyles}
                          contentLabel="Example Modal"
                        >
                          <div className="ModalqsnRarting">
                            <div className="heading">
                              <h2>{testData?.basic_info?.test_series_name}</h2>
                            </div>
                            <div className="retingText">
                              <h6>
                                Question:{" "}
                                {testData?.basic_info?.total_questions}
                              </h6>
                              <h6>
                                Rating: {testData?.basic_info?.avg_rating || 4.4 }
                              </h6>
                            </div>
                          </div>
                          <div className="BookmarkModalPart">
                            <h4>
                              <span>
                                <FaBookmark />
                              </span>
                              Bookmark ({bookmarks.length})
                            </h4>
                          </div>
                          <div className="CompleteModalPart">
                            <div className="HeaDIng">
                              <h2>
                                Complete
                                <span>
                                  <FaCircleCheck />
                                </span>
                              </h2>
                            </div>
                            <div className="completETest">
                              <p>
                                You completed this test on{" "}
                                {formatDateTime(completionTime)}.
                              </p>
                            </div>
                            <div className="table-responsive">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th className="atmp">{Attempted}</th>
                                    <th className="unatmp">{UnAttempted}</th>
                                    <th className="mark">{marked}</th>
                                    
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <span className="ryt">Right</span>
                                    </td>
                                    <td>
                                      <span className="wrng">Wrong</span>
                                    </td>
                                    <td>
                                      <span className="skip">Marked</span>
                                    </td>
                                
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="rateModalModule">
                              <h5>Please rate this Qbank Module</h5>
                              <div className="starRate">
                                <span>
                                  <FaRegStar style={{ pointer: "cursor" , color: starValue >= 1 ? "orange" : "black"}} onClick={() => handleStarClick(1)}/>
                                </span>
                                <span>
                                  <FaRegStar style={{ pointer: "cursor",color: starValue >= 2 ? "orange" : "black"}} onClick={() => handleStarClick(2)} />
                                </span>
                                <span>
                                  <FaRegStar style={{ pointer: "cursor",color: starValue >= 3 ? "orange" : "black"}} onClick={() => handleStarClick(3)} />
                                </span>
                                <span>
                                  <FaRegStar style={{pointer: "cursor", color: starValue >= 4 ? "orange" : "black"}} onClick={() => handleStarClick(4)} />
                                </span>
                                <span>
                                  <FaRegStar style={{pointer: "cursor", color: starValue >= 5 ? "orange" : "black"}} onClick={() => handleStarClick(5)} />
                                </span>
                              </div>
                            </div>
                            <div className="reviwModalbutn">
                              <Button
                                disabled={disableSubmit}
                                className="modal-but"
                                onClick={handlefinal}
                              >
                                Review
                              </Button>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </div>


                      <div className="bottom-nav">
                        <button
                          style={{ }}
                          onClick={handlePrev}
                          disabled={disableNav}
                        >
                          Prev
                        </button>

                        <button onClick={() => handleMark(index + 1)}>
                        {allmarked.includes(index+1)?"UnMark":" Mark for review"}
                        </button>

                        <button
                          style={{}}
                          onClick={handleNext}
                          disabled={disableNav}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </>
              ))}
            </div>

            <div className="que-status-cont">
              <div style={{ flexGrow: 1 }}>
                <h4
                  style={{}}
                >
                  Review Questions
                </h4>
                <div className="reviewQues"
                  
                >
                  {testData?.question_bank.map((que, index) => (
                    <button
                      className="que-no-box"
                      key={que.id}
                      style={{
                        backgroundColor: allmarked.includes(index + 1)
                          ? "blue"
                          : selectedOptions && selectedOptions[index + 1]
                          ? "green"
                          : "#d3d3d3",
                        textAlign: "center",
                        padding: "5px",
                        minWidth: "40px",
                        color: "white", borderRadius:"4px"
                      }}
                      disabled={disableNav}
                      onClick={() => setTab(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{display:'flex',justifyContent:'space-around'}}>
            
            <div className="mb-2">
              <FaCircle size={8} color="green" />
              <span> Attempted</span>
            </div>
          
     

     
            <div className="mb-3">
              <FaCircle size={8} color="#d3d3d3" />
              <span> Skipped</span>
            </div>
           
         

          <div className="mb-3">
              <FaCircle size={8} color="blue" />
              <span> Marked</span>
            </div>
        </div>
        

              <span className="submitBtn"
                
                onClick={handleSubmit}
              >
                SUBMIT
              </span>
            </div>
          </div>
        </div>
      </div>
      <Modal
                          isOpen={modalIsOpen2}
                          onAfterOpen={afterOpenModal}
                          style={customStyles2}
                          contentLabel="Example Modal"
                          
                        >
                          

                           <ModalBody>
                          <div style={{display:"flex",flexDirection:'column', alignItems: 'end'}}>

                          <Button className="closeIcon" onClick={()=>setIsOpen2(false)}><em className="fa fa-close"></em></Button>
                            <img className="popImgbg" src={imgurl} style={{height:'400px',width:'100%'}} />
                          </div>
                          </ModalBody>
                        
                        </Modal>
    </>
  );
};

export default ExamModeTest;
