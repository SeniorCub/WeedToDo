import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "../hooks/register";

const Register = () => {
     const { signInWithGoogle, loading } = useSignInWithGoogle(); // Using the hook

     return (
          <div className="bg-color1 text-white h-svh w-dvw overflow-hidden flex flex-col">
               <div className="basis-1/3 space-y-5 p-10 text-left">
                    <div>
                         <h1 className="font-semibold text-4xl">Welcome</h1>
                         <p className="font-normal">Sign up or Login to continue</p>
                    </div>
               </div>
               <div className='omo'>
                    <div className="w-full px-5 mx-auto md:w-1/2 space-y-5">
                         <button
                              className={`bg-color1 focus:outline-none focus:ring-4 focus:bg-color1 w-full rounded-lg py-2 text-white flex items-center justify-center gap-3 font-bold ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pry/50'}`}
                              onClick={signInWithGoogle}
                              disabled={loading}
                         >
                              {loading ? (
                                   <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>loading...</span>
                                   </div>
                              ) : (
                                   <>
                                        <FcGoogle />
                                        <span>Continue with Google</span>
                                   </>
                              )}
                         </button>
                    </div>
               </div>
          </div>
     );
}

export default Register;
