import { Link } from "react-router-dom"


const Splash = () => {
     return (
          <div className="bg-color1 h-svh w-dvw text-white p-6 flex flex-col">
               <div className="basis-2/4"></div>
               <div className="text-left flex flex-col gap-6 items-baseline justify-end">
                    <h1 className="font-semibold text-4xl">Plan, Achieve <br></br> and be Productive</h1>
                    <p className="text-sm pr-24 hidden md:block">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, alias sit officiis qui quidem molestiae harum nulla? Adipisci ratione voluptate explicabo ullam. Et incidunt doloremque sint modi, repudiandae nisi commodi. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique quibusdam explicabo ipsa aspernatur officiis veritatis est. Expr-20 cepturi maxime a tempora ea earum accusamus, velit iste ducimus, totam sed, necessitatibus recusandae?</p>
                    <Link  className="bg-white text-color1 w-full py-6 rounded-3xl text-xl mt-10 flex justify-center items-center" to={"/sign"}>Get Started</Link>
               </div>
          </div>
     )
}

export default Splash
