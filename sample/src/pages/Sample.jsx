import { useState } from "react"

function Sample(){
    const [value,setValue]= useState("");
    const handle =(event)=>{
    event.preventDefault()
    console.log("form done" +value)
   }
   
    return (
        <>  
       
        <form onClick={handle}>
        <div>
            <label>Name </label>
            <input type="text" onChange={(e)=>setValue(e.target.value) } className="name" placeholder="Name.." value={value} /> <br />
            <label htmlFor="">Email </label>
            <input type="email" className="email" placeholder="email!.." />
            <button type="submit">Submit</button>
        </div>
        </form>

        </>
    )
}
export default Sample;