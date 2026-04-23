import { useState } from "react";

export default function TaskList(){
const [value,setValue]=useState("");
 const handle=(event)=>{
    event.preventDefault()
    console.log("form submit",value);
    setValue("")
 }

    return(
        <>
            <form action="" onSubmit={handle}>
                <label htmlFor="">Tasks </label>
                <input type="text"
                onChange={(e)=>setValue(e.target.value)}
                 placeholder="tasks..."
                    value={value}
                 />

                <button type="submit">submit</button>
            </form>
        </>
    );
}