import { useEffect, useState } from "react";
import "./Dashboard.css";
import axiosInstance from "../../API/axiosConfig";
import { QrcodeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { Button, Carousel, Divider, Input, Modal, QRCode, Spin } from "antd";

import Chart from "react-apexcharts";
import { API_ENDPOINTS } from "../../ulits/apiConstant";

const Dashboard = ({
  all,
  btnValue,
  handleTodayClick,
  handleWeeklyClick,
  handleMonthlyClick,
  handleYearlyClick,
  dateRange,
  dashData,
}) => {
  const allData = JSON.parse(localStorage.getItem("allData"));
  // const joinIds = sessionStorage.getItem("joinId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [myStudent, setMyStudent] = useState({});
  const [arrayOfObjects, setArrayOfObjects] = useState([]);
  const [myAccount, setMyAccount] = useState({});
  const [myProfile, setMyProfile] = useState({});

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Series 1",
        data: [0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Day", "Weekly", "Monthly", "Yearly"],
      },
      yaxis: {
        title: {
          text: "",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
      colors: ["#FF3269", "#00A0CF", "#9F49A3", "#FFA523"],
    },
  });

  const showModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };
  const close = () => {
    setArrayOfObjects([]);
    setMyAccount({});
    setMyProfile({});
    setIsModalOpen(false);
  };

  const getStudentCalled = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.JOIN_AFFILIATE.MY_STUDENT_COUNT,
        {
          affiliate_id: allData?.affiliate_user_id,
        }
      );

      if (data.status === true) {
        setMyStudent(data.data);
        setLoading(false);
      } else {
        setIsModalOpen(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const getAccountCalled = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.JOIN_AFFILIATE.MY_ACCOUNT,
        {
          affiliate_id: allData?.affiliate_user_id,
        }
      );

      if (data.status === true) {
        setMyAccount(data.data);
        setLoading(false);
      } else {
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const getProfileCalled = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.JOIN_AFFILIATE.GET_PROFILE_INFO,
        {
          affiliate_user_id: allData?.affiliate_user_id,
        }
      );

      if (data.status === true) {
        setMyProfile(data.data);
        setLoading(false);
      } else {
        setLoading(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalData === "MyStudent") {
      getStudentCalled();
    } else if (modalData === "MyProfile") {
      getProfileCalled();
    } else if (modalData === "MyAccount") {
      getAccountCalled();
    } else if (modalData === "MyStats") {
    }
  }, [modalData]);

  useEffect(() => {
    if (myStudent) {
      const convertedData = Object.entries(myStudent).map(([key, value]) => ({
        key,
        value,
      }));
      setArrayOfObjects(convertedData);
    }
  }, [myStudent]);

  return (
    <>
      <div className="joinAffiliateLoginBG">
        <div className="container">
          <div className="MysaleData">
            <div className="proData">
              <div className="proImg">
                {/* <img src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/course.png" /> */}
                <img src={`${window.IMG_BASE_URL}/dams-icon/logo.png`} />
              </div>
              <div className="proText">
                <h3>Hello, {allData?.name}</h3>
                <h4>Start learning(Ambassador)</h4>
              </div>
            </div>

            <div className="OpendataTab">
              {dashData?.menu?.map((itm, i) => (
                <div
                  className="inerBox"
                  key={i}
                  onClick={() => showModal(`${itm.title.split(" ").join("")}`)}
                >
                  <div
                    className="innerData"
                    
                  >
                    <img src={itm.icon} width="50%" />
                  </div>
                  <p>{itm.title}</p>
                </div>
              ))}
            </div>

            <div className="tabbingdata">
              <h2>My Sales</h2>
              <Button
                type={btnValue === "1" && "primary"}
                onClick={handleTodayClick}
              >
                Today
              </Button>
              <Button
                type={btnValue === "2" && "primary"}
                onClick={handleWeeklyClick}
              >
                Weekly
              </Button>
              <Button
                type={btnValue === "3" && "primary"}
                onClick={handleMonthlyClick}
              >
                Monthly
              </Button>
              <Button
                type={btnValue === "4" && "primary"}
                onClick={handleYearlyClick}
              >
                Yearly
              </Button>
            </div>

            <div className="TotalSales">
              <div className="bobContent">
                <div className="boxdata comman">
                  <h3>₹ {!dashData?.not_sale ? "0" : dashData?.not_sale}</h3>
                  <p style={{ color: "#ff1e1e" }}>Rupees</p>
                </div>
                <h4>Net Sales</h4>
              </div>
              <div className="bobContent">
                <div className="boxdata comman">
                  <h3>{!dashData?.course ? "0" : dashData?.course}</h3>
                  <p style={{ color: "#ff8400" }}>Courses</p>
                </div>
                <h4>Total Purchasing</h4>
              </div>
              <div className="bobContent">
                <div className="boxdata comman">
                  <h3>₹ {!dashData?.earn ? "0" : dashData?.earn}</h3>
                  <p style={{ color: "#54b434" }}>Rupees</p>
                </div>
                <h4>Total Earning</h4>
              </div>
              <div className="bobContent">
                <div className="boxdata comman">
                  <h3>{dashData?.student}</h3>
                  <p style={{ color: "#9336b4" }}>Student</p>
                </div>
                <h4>Total Student</h4>
              </div>
            </div>
            <div className="chartData">
              <h2>Net Sale</h2>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
              />
            </div>
            {/* <Divider /> */}
            <div className="salesBanner">
             
            </div>
            <Divider />

            <div className="text-center">
              <Button
                icon={<QrcodeOutlined />}
                type="primary"
                onClick={() => setIsQRModalOpen(true)}
              >
                Open QR
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="myStudentModalPop"
        title={modalData}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={close}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            {modalData === "MyStudent" ? (
              <>
                {arrayOfObjects?.map((itm, i) => (
                  <div
                    className="BoxSet"
                    key={i}
                   
                  >
                    <h2>{itm?.value}</h2>
                    <span>
                      {itm?.key
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </div>
                ))}
              </>
            ) : modalData === "MyAccount" ? (
              <div className="myAccountModalPop">
                <div className="netsaleData">
                  <h4>{!myAccount?.net_sel ? "0.00" : myAccount?.net_sel}</h4>
                  <p>Net Sales</p>
                </div>
                <div className="netsaleData">
                  <h4>
                    {!myAccount?.all_purchased
                      ? "0.00"
                      : myAccount?.all_purchased}
                  </h4>
                  <p>All Purchase</p>
                </div>
              </div>
            ) : modalData === "MyStats" ? (
              <>
                <div className="myChartModalPop">
                  <p>No Data</p>
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={350}
                  />
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={350}
                  />
                </div>
              </>
            ) : (
              <div className="formInputData">
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.profile_info?.first_name}
                      disabled
                      prefix="Name:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.profile_info?.email}
                      disabled
                      prefix="Email:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.profile_info?.phone}
                      disabled
                      prefix="Phone:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.profile_info?.address}
                      disabled
                      prefix="Address:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                </div>
                <Divider />
                <p style={{ marginBottom: "8px" }}>
                  <b>Bank Deatils</b>
                </p>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.bank_info?.bank_name}
                      disabled
                      prefix="Bank Name:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.bank_info?.ifsc_code}
                      disabled
                      prefix="IFSC:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.bank_info?.account_number}
                      disabled
                      prefix="Account No:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                </div>
                <img src={myProfile?.profile_info?.bank_image} width="20%" />
                <Divider />
                <p style={{ marginBottom: "8px" }}>
                  <b>Address Proof</b>
                </p>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.profile_info?.aadhar}
                      disabled
                      prefix="Id Proof number:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                  <div className="col-12 col-md-6 mb-2">
                    <Input
                      size="large"
                      placeholder={myProfile?.profile_info?.pancard}
                      disabled
                      prefix="Pan Card number:"
                      style={{ margin: "2px" }}
                    />
                  </div>
                </div>
                <img src={myProfile?.profile_info?.aadhar_image} width="20%" />
                <img src={myProfile?.profile_info?.pan_image} width="20%" />
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal
        //title="QR"
        open={isQRModalOpen}
        onOk={() => setIsQRModalOpen(false)}
        onCancel={() => setIsQRModalOpen(false)}
      >
        <div className="openQrData">
          <div className="openQrPic">
      
            <img src="/logo.png" />
          </div>
          <h3>{allData?.name}</h3>
          <p>
            Affiliate Id:
            <b style={{ marginLeft: "5px" }}>{allData?.affiliate_user_id}</b>
          </p>
          <QRCode
            type="canvas"
            value={allData?.name}
            style={{ marginTop: "20px" }}
          />
          <h6>Share your code and get profit on every purchase</h6>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard;
