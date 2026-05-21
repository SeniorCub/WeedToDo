// import Button from "../components/Button"
import img from "../assets/images/amico.0f21f32000ef9ea2915a.png"

const Error = () => {
     return (
          <div className="flex justify-center items-center">
               <div className="space-y-5">
                    <h1 className="text-red-500 text-5xl font-bold">Oh No!</h1>
                    <p>Something is gone missing.</p>
                    <p>Nothing is found here! You can check your Internet connection or check back later.</p>
                    {/* <Button name={'Go Back'} style={'bg-black text-white'} link={'/'}/> */}
               </div>
               <div>
                    <img src={img} alt="" />
               </div>
          </div> 
     )
}

export default Error
