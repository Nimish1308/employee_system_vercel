import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router'

const Details = () => {
  const {id}=useParams();
  const [record,setRecord]=useState([]);
  const [lastUpdatedText, setLastUpdatedText] = useState('')

  const getRecord=async()=>{
   try {
    const res=await axios.get(`http://localhost:5000/findbyid/${id}`);
    const store=res.data;
    setRecord(store);
     calculateLastUpdated(store.lastUpdated); // Update the relative time
    console.log(`Employee Record Fetched Successfully`);
    console.log(store);
    
    
   } catch (error) {
     console.error(`Failed to fetch employee details`);
     
   }
  }

  const calculateLastUpdated = (lastUpdated) => {
        if (!lastUpdated) return;

        const updatedDate = new Date(lastUpdated);
        const now = new Date();
        const diffInMinutes = Math.floor((now - updatedDate) / (1000 * 60));

        if (diffInMinutes < 1) {
            setLastUpdatedText('Just now');
        } else if (diffInMinutes === 1) {
            setLastUpdatedText('1 minute ago');
        } else if (diffInMinutes < 60) {
            setLastUpdatedText(`${diffInMinutes} minutes ago`);
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            setLastUpdatedText(`${hours} hour${hours > 1 ? 's' : ''} ago`);
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            setLastUpdatedText(`${days} day${days > 1 ? 's' : ''} ago`);
        }
    };

  useEffect(()=>{
    getRecord();
  },[])

  return (
    <>
      <div class="card mb-3" style={{width:'70%',margin:'90px',border:'2px solid black',boxShadow:'20px 20px 20px 20px '}}>
        <div class="row g-0"> 
          <div class="col-md-4">
            <img
              src={record.photo}
              alt="Trendy Pants and Shoes"
              class="img-fluid rounded-start"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h1 class="card-title" style={{textAlign:'center'}}>Employee Details</h1>
              <hr style={{border:'3px solid black'}}/>
              <h3 class="card-title">Name: {record.name}</h3>
              <h3 class="card-title">Age: {record.age}</h3>
              <h3 class="card-title">Gender: {record.gender}</h3>
              <h3 class="card-title">Field: {record.field}</h3>
              <h3 class="card-title">Description:</h3>
              <p class="card-text">
               {record.description}
              </p>
              <p class="card-text">
                <small className="text-muted">Last updated {lastUpdatedText}</small>
              </p>

              <NavLink to={`/`}><Button variant="primary">Back</Button></NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Details
