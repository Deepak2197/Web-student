import "../Mystudy/style.css";
import "../Mystudy/responsive.css";

const Selfattendance = () => {
  return (
    <div className='Selfattendance'>
        <div className="page-content position-relative">
            <div className="breadcrumb-row">
                <div className="container">
                    <ul className="list-inline">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>Self Attendance</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='selfData'>
            <div className='container'>
                <div className='imgGroup'>
                    <img src='' />
                    <div className='textdata'>
                        <h3 className='text-suucess'>Your selfie match with your profile picture</h3>
                       
                    </div>
                </div>
                <div className='btnshowdata'>
                    <button type="button">Retake</button>
                    <button type="button" className="next">Next</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Selfattendance