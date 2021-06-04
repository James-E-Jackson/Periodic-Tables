import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

function Search(){
    const [error, setError] = useState(null);
    
    return (
        <div>
            <ErrorAlert error={error} />
            <p>Search</p>
        </div>)
}

export default Search;