
import "../Mystudy/style.css";
import "../Mystudy/responsive.css";

const Scanqrdata = () => {

  return (
    <div className='ScanqrData'>
        <div className="page-content position-relative">
            <div className="breadcrumb-row">
                <div className="container">
                    <ul className="list-inline">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>Scan QR</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='Scandata'>
            <div className='container'>
                <div className="profile-card">
                    <div className="headertop">
                        <div className="proImg">
                            <img src='' className="profile-pic" />
                        </div>
                        <div className="prodetail">
                            <h2 className="name">Aman Kumar</h2>
                        </div>
                    </div>

                    <div className="qr-section">
                        <img src='' />
                    </div>
                    <div className="btnData">
                        <button type="button" className="selfAtte">Mark Attendance</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Scanqrdata