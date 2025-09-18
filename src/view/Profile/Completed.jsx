import { FaGift } from "react-icons/fa";

function Completed() {
  return (
    <div className='completepage'> 
        <div className='container'>
            <div className='updatePro'>
                <FaGift style={{fontSize:"100px",color:"green"}} />
                {/* <h3>Congratulation your profile is completed</h3> */}
                 <h3>Congratulation your Login Pin is Set</h3>
                {/* <p>You have won 5 reward points</p> */}
                {/* <button type="button">Continue</button> */}
            </div>
        </div>
    </div>
  )
}

export default Completed