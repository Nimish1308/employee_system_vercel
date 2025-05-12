import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import { NavLink, useParams } from 'react-router'

const Update = () => {
  const [image,setImage]=useState([]);
  const { id } = useParams();
  const [input, setInput] = useState({
    name: "",
    age: "",
    gender: "",
    field: "",
    description: "",
    photo: ""
  })

  const handleChange = (event) => {
    const { name, files } = event.target;
    if (name === 'photo') {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setInput((prev) => ({
          ...prev,
          photo: reader.result
        }))
      }

      reader.readAsDataURL(file)
    }
    else {
      setInput((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/update/${id}`, input);
      console.log(`Employee Details Updated Successfully`);
      window.alert(`Employee Details Updated Successfully`);
      getRecord();
    } catch (error) {
      console.log(`Failed To Update Details`);

    }


  }

   const getRecord = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/findbyid/${id}`);
        setInput({
          name: res.data.name,
          age: res.data.age,
          gender: res.data.gender,
          field: res.data.field,
          description: res.data.description
        })

        setImage(res.data);
      } catch (error) {
        console.error(error);

      }
    }

  useEffect(()=>{
    getRecord()
  },[])
  return (
    <>
      <Form className='container' style={{ border: '2px solid black', margin: '20px', padding: '20px', borderRadius: '30px' }}
        onSubmit={handleSubmit}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Full Name:</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name='name' value={input.name} onChange={handleChange} />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Age:</Form.Label>
          <Form.Control type="text" placeholder="Enter age" name='age' value={input.age} onChange={handleChange} />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail" id='gender_body'>
          <Form.Label>Gender:</Form.Label>

          <Form.Check type="radio" label="Male" value="Male" name='gender' id='gender'
            checked={input.gender === "Male"} onChange={handleChange} />

          <Form.Check type="radio" label="Female" value="Female" name='gender' id='gender'
            checked={input.gender === "Female"} onChange={handleChange} />

          <Form.Check type="radio" label="Other" value="Other" name='gender' id='gender'
            checked={input.gender === "Other"} onChange={handleChange} />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Field:</Form.Label>
          <Form.Control as='select' name='field' value={input.field} onChange={handleChange}>
            <option value="">Select Field</option>
            <option value="MERN">MERN</option>
            <option value="FSD">FSD</option>
            <option value="Associate">Associate</option>
            <option value="IT">IT</option>
          </Form.Control>

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Description:</Form.Label>
          <Form.Control as='textarea' rows={4} placeholder="Enter description" name='description' value={input.description} onChange={handleChange} />

        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Upload Photo:</Form.Label>
          <Form.Control type="file" name='photo' onChange={handleChange} />

        </Form.Group>

         {
            image && (
              <img src={image.photo} alt="" srcset="" style={{width:'90px',height:'90px'}}/>
            )
         }
         <br />

        <Button variant="primary" type="submit" id='btn_type'>
          Update
        </Button>

       <NavLink to={`/`}>
         <Button variant="primary" type="submit" id='btn_type'>
          Back
        </Button>
       </NavLink>
      </Form>
    </>
  )
}

export default Update
