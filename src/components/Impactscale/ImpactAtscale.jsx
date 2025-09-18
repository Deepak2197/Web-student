import React from "react";
import "../../assets/css/home-page/style.css";
function ImpactAtscale() {
  return (
    <section className="impact-at-scale position-relative">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 ">
            <div className="globe_heading text-center">
              <h2 className="font-weight-bold mb-3">Impact At scale </h2>
              <p>Making education affordable and accessible across the globe</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <div className="impact_text">
              <img className="" src="/question-and-answer.svg" loading="lazy" alt="icon image" />
              <h3>25 K +</h3>
              <p className="m-0">Questions &amp; Q Bank</p>
            </div>
          </div>
          <div className="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <div className="impact_text">
              <img className="" src="/online-course.svg" loading="lazy" alt="icon image" />
              <h3>200 +</h3>
              <p className="m-0">Courses</p>
            </div>
          </div>
          <div className="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <div className="impact_text">
              <img className="videcamera" src={`${window.IMG_BASE_URL}/dams-icon/video-camera.svg`} loading="lazy" alt="icon image" />
              <h3>2.5 M +</h3>
              <p className="m-0">Video Lecture</p>
            </div>
          </div>
          <div className="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <div className="impact_text">
              <img className="" src="/download-icon.svg" loading="lazy" alt="icon image" />
              <h3>1 M +</h3>
              <p className="m-0">Downloads</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default ImpactAtscale;
