import "../Mystudy/style.css";
import "../Mystudy/responsive.css";
const Attendancesuccess = () => {
  return (
    <div className='Attendancesuccess'>
        <div className="page-content position-relative">
            <div className="breadcrumb-row">
                <div className="container">
                    <ul className="list-inline">
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>Your mark attendance Successfully</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className='Markattendance-success'>
            <div className='container'>
                <img src='' />
                <div className='succestext'>
                    <h2>Thank you!</h2>
                    <p>Your mark attendance successfully</p>
                </div>
                <div className='homebtn'>
                    <button type='button'><em className='fa fa-home'></em>Home</button>
                </div>
            </div>
        </div>


    </div>
  )
}

export default Attendancesuccess